import React, { createContext, useContext, useEffect, useState } from 'react';

// Puter.js is loaded via the script in index.html and should be available as a global
declare global {
    interface Window {
        puter: any;
    }
}

const puter = window.puter;

interface PuterContextType {
    isSignedIn: boolean;
    user: any;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    ai: any;
    kv: any;
}

const PuterContext = createContext<PuterContextType | undefined>(undefined);

export const PuterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (window.puter) {
                try {
                    const signedIn = await window.puter.auth.isSignedIn();
                    setIsSignedIn(signedIn);
                    if (signedIn) {
                        const user = await window.puter.auth.getUser();
                        setUser(user);
                    }
                } catch (e) {
                    console.error("Auth check failed", e);
                }
            }
            setLoading(false);
        };
        
        if (window.puter) {
            checkAuth();
        }
        else {
            const interval = setInterval(() => {
                if (window.puter) {
                    clearInterval(interval);
                    checkAuth();
                }
            }, 100);
        }
    }, []);

    const signIn = async () => {
        try {
            await window.puter.auth.signIn();
            const signedIn = await window.puter.auth.isSignedIn();
            setIsSignedIn(signedIn);
            if (signedIn) {
                const user = await window.puter.auth.getUser();
                setUser(user);
            }
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };

    const signOut = async () => {
        try {
            await window.puter.auth.signOut();
            setIsSignedIn(false);
            setUser(null);
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-400 font-mono text-sm animate-pulse">
            Booting ENTITY...
        </div>
    );

    return (
        <PuterContext.Provider value={{ 
            isSignedIn, 
            user, 
            signIn, 
            signOut, 
            ai: window.puter.ai, 
            kv: window.puter.kv 
        }}>
            {children}
        </PuterContext.Provider>
    );
};

export const usePuter = () => {
    const context = useContext(PuterContext);
    if (context === undefined) {
        throw new Error('usePuter must be used within a PuterProvider');
    }
    return context;
};
