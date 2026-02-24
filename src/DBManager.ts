import initSqlJs from 'sql.js';

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
        try {
            this.sqlInstance = await initSqlJs({
                locateFile: (file: string) => `https://sql.js.org/dist/${file}`
            });
            await tools.cloneRepo(this.config.repoUrl);
            await this.loadDatabase(tools);
            await this.loadMetadata(tools);
            await this.applyMigrations(tools);
        } catch (error) {
            console.error("DB Manager Init Error:", error);
            await this.createNewDatabase();
        }
    }

    private async loadDatabase(tools: any) {
        try {
            const data = await tools.readFile(this.config.dbPath);
            // Fallback: If decompression is needed, we'd use a browser-safe library here.
            // For now, we load directly if not compressed or handle missing lib.
            this.db = new this.sqlInstance.Database(new Uint8Array(data));
        } catch (error) {
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
        if (!this.sqlInstance) return;
        this.db = new this.sqlInstance.Database();
        this.db.run(`
            CREATE TABLE IF NOT EXISTS chat_history (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, sender TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS agent_memo (key TEXT PRIMARY KEY, value TEXT);
        `);
    }

    private async applyMigrations(tools: any) {
        try {
            const files = await tools.listDir(this.config.migrationsPath);
            const migrationFiles = (files || [])
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
            console.warn("Migrations skipped:", e);
        }
    }

    async saveChanges(tools: any) {
        if (!this.db) return;
        try {
            const dbBlob = this.db.export();
            await tools.writeFile(this.config.dbPath, dbBlob);
            await tools.writeFile(this.config.metadataPath, JSON.stringify(this.metadata));
            await tools.commitToRepo(`[ENTITY DB] Synced`);
            await tools.pushToRepo();
        } catch (e) {
            console.error("Failed to save DB changes", e);
        }
    }

    async query(sql: string, params: any[] = []): Promise<any[]> {
        if (!this.db) return [];
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) { rows.push(stmt.get()); }
        stmt.free();
        return rows;
    }

    async addChatMessage(message: string, sender: string, tools: any): Promise<void> {
        if (!this.db) return;
        this.db.run("INSERT INTO chat_history (message, sender) VALUES (?, ?)", [message, sender]);
        await this.saveChanges(tools);
    }
}
