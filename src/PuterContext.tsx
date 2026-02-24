import React, { createContext, useContext, useEffect, useState } from 'react';
import { V86Manager } from './V86Manager';
import { DBManager } from './DBManager';

declare global {
    interface Window {
        puter: any;
    }
}

interface PuterContextType {
    isSignedIn: boolean;
    user: any;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    ai: any;
    kv: any;
    vm: V86Manager | null;
    db: DBManager | null;
    tools: any;
}

const PuterContext = createContext<PuterContextType | undefined>(undefined);

export const PuterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [vm, setVm] = useState<V86Manager | null>(null);
    const [db, setDb] = useState<DBManager | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.puter) {
                    const signedIn = await window.puter.auth.isSignedIn();
                    setIsSignedIn(signedIn);
                    if (signedIn) {
                        const userData = await window.puter.auth.getUser();
                        setUser(userData);
                        
                        // Initialize VM - Non-blocking
                        try {
                            const vmManager = new V86Manager(() => console.log("VM Ready"));
                            vmManager.boot(); // Don't await boot here to prevent hang
                            setVm(vmManager);
                        } catch (e) { console.error("VM Init failed", e); }

                        // Initialize DB Manager - Configuration
                        const dbManager = new DBManager({
                            repoUrl: `https://github.com/${userData.username}/entity-db.git`,
                            dbPath: "db.sqlite3.xz",
                            migrationsPath: "migrations/",
                            metadataPath: "metadata.json"
                        });
                        setDb(dbManager);
                    }
                }
            } catch (error) {
                console.error("Critical Init Error:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const signIn = async () => {
        try {
            await window.puter.auth.signIn();
            window.location.reload();
        } catch (e) { console.error(e); }
    };

    const signOut = async () => {
        try {
            await window.puter.auth.signOut();
            setIsSignedIn(false);
            setUser(null);
        } catch (e) { console.error(e); }
    };

    const tools = {
        readFile: async (path: string) => {
            try { return await window.puter.fs.read(path); }
            catch { return await vm?.readFile(path); }
        },
        writeFile: async (path: string, data: string) => {
            try { await window.puter.fs.write(path, data); }
            catch { await vm?.writeFile(path, data); }
        },
        listDir: async (path: string) => {
            return await window.puter.fs.list(path);
        },
        execInVM: async (command: string) => {
            return await vm?.exec(command);
        },
        invokeCI: async (workflow: string, inputs: any) => {
            console.log(`Invoking CI: ${workflow}`, inputs);
        },
        commitToRepo: async (message: string) => {
            console.log(`Commit: ${message}`);
        },
        pushToRepo: async () => {
            console.log("Pushing to repo...");
        },
        cloneRepo: async (url: string) => {
            console.log(`Cloning: ${url}`);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center text-indigo-500 font-black gap-4">
            <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full agent-gradient animate-pulse" style={{width: '60%'}} />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase">Synchronizing Entity...</span>
        </div>
    );

    return (
        <PuterContext.Provider value={{ isSignedIn, user, signIn, signOut, ai: window.puter?.ai, kv: window.puter?.kv, vm, db, tools }}>
            {children}
        </PuterContext.Provider>
    );
};

export const usePuter = () => {
    const context = useContext(PuterContext);
    if (!context) throw new Error('usePuter must be used within PuterProvider');
    return context;
};
