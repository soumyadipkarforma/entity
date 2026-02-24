import React, { createContext, useContext, useEffect, useState } from 'react';

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
    vm: any;
    db: any;
    tools: any;
}

const PuterContext = createContext<PuterContextType | undefined>(undefined);

export const PuterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.puter) {
                    const signedIn = await window.puter.auth.isSignedIn();
                    setIsSignedIn(signedIn);
                    if (signedIn) {
                        const userData = await window.puter.auth.getUser();
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error("Critical Init Error:", error);
            } finally {
                setLoading(false);
            }
        };
        
        // Polling for window.puter
        const interval = setInterval(() => {
            if (window.puter) {
                clearInterval(interval);
                init();
            }
        }, 100);

        // Fallback timeout
        setTimeout(() => {
            clearInterval(interval);
            setLoading(false);
        }, 5000);

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
            return await window.puter.fs.read(path);
        },
        writeFile: async (path: string, data: string) => {
            return await window.puter.fs.write(path, data);
        },
        listDir: async (path: string) => {
            return await window.puter.fs.list(path);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-sm">
            [ INITIALIZING ENTITY KERNEL... ]
        </div>
    );

    return (
        <PuterContext.Provider value={{ isSignedIn, user, signIn, signOut, ai: window.puter?.ai, kv: window.puter?.kv, vm: null, db: null, tools }}>
            {children}
        </PuterContext.Provider>
    );
};

export const usePuter = () => {
    const context = useContext(PuterContext);
    if (!context) throw new Error('usePuter must be used within PuterProvider');
    return context;
};