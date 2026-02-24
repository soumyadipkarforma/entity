import initSqlJs from 'sql.js';
import { compress, decompress } from 'lzma';

interface DBManagerConfig {
    repoUrl: string;
    dbPath: string;
    migrationsPath: string;
    metadataPath: string;
}

export class DBManager {
    private db: any;
    private metadata: any = { lastAppliedMigration: null };
    private sqlInstance: any;
    private config: DBManagerConfig;

    constructor(config: DBManagerConfig) {
        this.config = config;
    }

    async initialize(tools: any) {
        this.sqlInstance = await initSqlJs({
            locateFile: (file: string) => `https://sql.js.org/dist/${file}`
        });
        try {
            await tools.cloneRepo(this.config.repoUrl);
            await this.loadDatabase(tools);
            await this.loadMetadata(tools);
            await this.applyMigrations(tools);
        } catch (error) {
            console.error("Failed to initialize DB Manager:", error);
            await this.createNewDatabase();
        }
    }

    private async loadDatabase(tools: any) {
        try {
            const compressedDb = await tools.readFile(this.config.dbPath);
            return new Promise((resolve, reject) => {
                decompress(compressedDb, (result: any, error: any) => {
                    if (error) reject(error);
                    else {
                        this.db = new this.sqlInstance.Database(new Uint8Array(result as number[]));
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            console.warn("Could not load existing database, creating new one.", error);
            await this.createNewDatabase();
        }
    }

    private async loadMetadata(tools: any) {
        try {
            const metadataContent = await tools.readFile(this.config.metadataPath);
            this.metadata = JSON.parse(metadataContent);
        } catch (error) {
            this.metadata = { lastAppliedMigration: null };
        }
    }

    private async createNewDatabase() {
        this.db = new this.sqlInstance.Database();
        this.db.run(`
            CREATE TABLE IF NOT EXISTS chat_history (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, sender TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS embeddings (id INTEGER PRIMARY KEY AUTOINCREMENT, data BLOB, metadata TEXT);
            CREATE TABLE IF NOT EXISTS agent_memo (key TEXT PRIMARY KEY, value TEXT);
        `);
        this.metadata = { lastAppliedMigration: null };
    }

    private async applyMigrations(tools: any) {
        try {
            const files = await tools.listDir(this.config.migrationsPath);
            const migrationFiles = files
                .filter((f: any) => f.name.endsWith('.sql'))
                .sort((a: any, b: any) => a.name.localeCompare(b.name));

            for (const migrationFile of migrationFiles) {
                if (this.metadata.lastAppliedMigration === null || migrationFile.name > this.metadata.lastAppliedMigration) {
                    const migrationSql = await tools.readFile(`${this.config.migrationsPath}${migrationFile.name}`);
                    this.db.run(migrationSql);
                    this.metadata.lastAppliedMigration = migrationFile.name;
                }
            }
        } catch (e) {
            console.error("Migration error", e);
        }
    }

    async saveChanges(tools: any) {
        if (!this.db) return;
        const dbBlob = this.db.export();
        return new Promise((resolve, reject) => {
            compress(dbBlob, 9, (result: any, error: any) => {
                if (error) reject(error);
                else {
                    (async () => {
                        await tools.writeFile(this.config.dbPath, new Uint8Array(result));
                        await tools.writeFile(this.config.metadataPath, JSON.stringify(this.metadata, null, 2));
                        await tools.commitToRepo(`[ENTITY DB] Update`);
                        await tools.pushToRepo();
                        resolve(true);
                    })();
                }
            });
        });
    }

    async query(sql: string, params: any[] = []): Promise<any[]> {
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
            rows.push(stmt.get());
        }
        stmt.free();
        return rows;
    }

    async getChatHistory(): Promise<any[]> {
        return this.query("SELECT * FROM chat_history ORDER BY timestamp ASC");
    }

    async addChatMessage(message: string, sender: string, tools: any): Promise<void> {
        this.db.run("INSERT INTO chat_history (message, sender) VALUES (?, ?)", [message, sender]);
        await this.saveChanges(tools);
    }
}