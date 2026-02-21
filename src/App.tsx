import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { PuterProvider, usePuter } from './PuterContext';
import { Terminal, Github, Code2, LayoutDashboard, LogOut, Search, Settings, Cpu, ChevronRight, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

const Navbar = () => {
    const { isSignedIn, signOut, user } = usePuter();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-zinc-950">
                        <Terminal size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ENTITY</span>
                </Link>

                <div className="flex items-center space-x-4">
                    {isSignedIn ? (
                        <>
                            <Link 
                                to="/dashboard" 
                                className="flex items-center space-x-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
                            >
                                <LayoutDashboard size={18} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <div className="h-4 w-px bg-zinc-800 mx-2" />
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-zinc-400 hidden sm:inline">
                                    {user?.username || 'User'}
                                </span>
                                <button 
                                    onClick={signOut}
                                    className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-all"
                                    title="Sign out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button 
                            className="inline-flex items-center rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors"
                            onClick={() => window.location.href = '#'} // Logic will be in landing
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

const Landing = () => {
    const { signIn, isSignedIn } = usePuter();

    if (isSignedIn) return <Navigate to="/dashboard" />;

    return (
        <div className="relative pt-32 pb-20 px-4">
            <div className="mx-auto max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-400 mb-6">
                        Built on Puter.js
                    </span>
                    <h1 className="text-6xl font-extrabold tracking-tight sm:text-8xl mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        Code at the speed of thought.
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl mb-10">
                        ENTITY is the agentic IDE that understands your codebase. 
                        Connect GitHub, deploy AI agents, and build faster than ever.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={signIn}
                            className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-50 px-8 text-zinc-950 transition-all hover:pr-10 active:scale-95"
                        >
                            <span className="font-bold uppercase tracking-wider">Start Coding</span>
                            <ChevronRight size={18} className="absolute right-4 transition-all group-hover:right-3 opacity-0 group-hover:opacity-100" />
                        </button>
                        <button className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-8 font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-50">
                            <Github size={18} />
                            View on GitHub
                        </button>
                    </div>
                </motion.div>

                {/* Preview Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-24 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 backdrop-blur-xl shadow-2xl"
                >
                    <div className="aspect-[16/9] w-full rounded-xl bg-zinc-950 p-4 border border-zinc-800/50 flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-3 w-3 rounded-full bg-red-500/50" />
                            <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                            <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                            <div className="flex-1" />
                            <div className="h-6 w-32 rounded bg-zinc-900 border border-zinc-800" />
                        </div>
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            <div className="col-span-1 border-r border-zinc-900 pr-4 space-y-2">
                                <div className="h-4 w-full rounded bg-zinc-900" />
                                <div className="h-4 w-4/5 rounded bg-zinc-900" />
                                <div className="h-4 w-full rounded bg-zinc-900" />
                                <div className="h-4 w-2/3 rounded bg-zinc-900" />
                            </div>
                            <div className="col-span-3 font-mono text-zinc-600 text-sm overflow-hidden flex flex-col">
                                <div className="flex items-center text-zinc-400 mb-2 border-b border-zinc-900 pb-2">
                                    <Code2 size={14} className="mr-2" /> index.tsx
                                </div>
                                <div className="space-y-1">
                                    <p><span className="text-zinc-500">const</span> ENTITY = () =&gt; &#123;</p>
                                    <p className="pl-4"><span className="text-zinc-500">const</span> [state, setState] = useState(null);</p>
                                    <p className="pl-4 text-zinc-400">/* Agentic coding enabled... */</p>
                                    <p className="pl-4 bg-zinc-900/50 text-zinc-100 border-l border-zinc-50 px-2 py-1 flex items-center gap-2">
                                        <Wand2 size={12} className="text-zinc-500" /> Generating implementation...
                                    </p>
                                    <p>&#125;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

import { Octokit } from '@octokit/rest';

const Dashboard = () => {
    const { isSignedIn, kv } = usePuter();
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [newToken, setNewToken] = useState("");

    const fetchRepos = async (ghToken: string) => {
        setLoading(true);
        try {
            const octokit = new Octokit({ auth: ghToken });
            const { data } = await octokit.repos.listForAuthenticatedUser({
                sort: 'updated',
                per_page: 20
            });
            setRepos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isSignedIn) {
            kv.get('gh_token').then((val: any) => {
                if (val) {
                    setToken(val);
                    fetchRepos(val);
                } else {
                    setLoading(false);
                }
            });
        }
    }, [isSignedIn]);

    const handleSaveToken = async () => {
        if (!newToken) return;
        await kv.set('gh_token', newToken);
        setToken(newToken);
        setShowTokenInput(false);
        fetchRepos(newToken);
    }

    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
            <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight">Your Workspace</h2>
                    <p className="text-zinc-500 mt-2 text-lg">Manage your GitHub repositories and start coding.</p>
                </div>
                {!token && !showTokenInput && (
                   <button 
                        onClick={() => setShowTokenInput(true)}
                        className="flex items-center gap-2 rounded-xl bg-zinc-50 px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200 transition-all"
                    >
                        <Github size={18} />
                        Connect GitHub
                    </button>
                )}
            </header>

            {showTokenInput && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Settings className="text-zinc-500" size={20} />
                        Enter GitHub Personal Access Token
                    </h3>
                    <p className="text-zinc-400 text-sm mb-6 max-w-2xl">
                        To fetch and push to your repositories, ENTITY needs a PAT with 'repo' permissions. 
                        We store this securely in your Puter.js account's private key-value store.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                        <input 
                            type="password"
                            value={newToken}
                            onChange={(e) => setNewToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                        />
                        <div className="flex gap-2">
                            <button 
                                onClick={handleSaveToken}
                                className="px-6 py-3 rounded-xl bg-zinc-50 text-zinc-950 font-bold text-sm hover:bg-zinc-200"
                            >
                                Save Token
                            </button>
                            <button 
                                onClick={() => setShowTokenInput(false)}
                                className="px-6 py-3 rounded-xl border border-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-900 hover:text-zinc-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
                    ))}
                </div>
            ) : repos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo) => (
                        <motion.div 
                            layout
                            key={repo.id} 
                            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900 shadow-lg hover:shadow-zinc-950/50"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-100 group-hover:bg-zinc-700 transition-colors">
                                    <Github size={20} />
                                </div>
                                <div className="flex items-center space-x-2 text-xs font-medium px-2 py-1 rounded-full bg-zinc-800/50 text-zinc-400">
                                    <span className={`h-1.5 w-1.5 rounded-full ${repo.private ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <span>{repo.private ? 'Private' : 'Public'}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-zinc-50 truncate">{repo.name}</h3>
                            <p className="text-sm text-zinc-500 line-clamp-2 mb-8 h-10">
                                {repo.description || "No description provided."}
                            </p>
                            <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
                                <span className="text-xs text-zinc-500 font-medium px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                                    {repo.language || 'Code'}
                                </span>
                                <Link 
                                    to={`/editor/${repo.owner.login}/${repo.name}`}
                                    className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-50 px-4 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
                                >
                                    Open Workspace
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/20">
                     <div className="h-16 w-16 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 mb-6">
                        <Github size={32} />
                    </div>
                    <p className="text-zinc-400 font-medium text-lg mb-8">No repositories found or token not provided.</p>
                    {!showTokenInput && (
                        <button 
                            onClick={() => setShowTokenInput(true)}
                            className="px-8 py-3 rounded-xl bg-zinc-50 text-zinc-950 font-bold hover:bg-zinc-200 transition-all"
                        >
                            {token ? "Refresh Token" : "Connect GitHub"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

import { useParams } from 'react-router-dom';

const EditorPage = () => {
    const { owner, repo } = useParams();
    const { isSignedIn, ai, kv } = usePuter();
    const [prompt, setPrompt] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isPushing, setIsPushing] = useState(false);
    const [ghToken, setGhToken] = useState<string | null>(null);

    useEffect(() => {
        kv.get('gh_token').then(setGhToken);
    }, []);

    useEffect(() => {
        if (owner && repo && ghToken) {
            const octokit = new Octokit({ auth: ghToken });
            octokit.repos.getContent({ owner, repo, path: '' })
                .then(({ data }: any) => {
                    setFiles(Array.isArray(data) ? data : []);
                })
                .catch(console.error);
        }
    }, [owner, repo, ghToken]);

    const handleFileSelect = async (file: any) => {
        if (file.type === 'dir') return;
        setSelectedFile(file.path);
        setLoading(true);
        try {
            const octokit = new Octokit({ auth: ghToken! });
            const { data }: any = await octokit.repos.getContent({ owner: owner!, repo: repo!, path: file.path });
            const decoded = atob(data.content);
            setContent(decoded);
        } catch (e) {
            console.error(e);
            setContent("Error loading file.");
        } finally {
            setLoading(false);
        }
    };

    const handleAgenticAction = async () => {
        if (!prompt || !selectedFile) return;
        setLoading(true);
        try {
            const systemPrompt = `You are ENTITY, an agentic coding assistant.
Current file: ${selectedFile}
Content:
\`\`\`
${content}
\`\`\`
Task: ${prompt}
Respond ONLY with the updated file content. Do not include explanations or markdown blocks.`;
            
            const result = await ai.chat(systemPrompt);
            setContent(result.toString().trim());
            setPrompt("");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePush = async () => {
        if (!selectedFile || !content || !ghToken) return;
        setIsPushing(true);
        try {
            const octokit = new Octokit({ auth: ghToken });
            // Get current file SHA
            const { data: currentFile }: any = await octokit.repos.getContent({ 
                owner: owner!, 
                repo: repo!, 
                path: selectedFile 
            });
            
            await octokit.repos.createOrUpdateFileContents({
                owner: owner!,
                repo: repo!,
                path: selectedFile,
                message: `Agentic update to ${selectedFile} via ENTITY`,
                content: btoa(content),
                sha: currentFile.sha
            });
            alert("Changes pushed successfully!");
        } catch (e) {
            console.error(e);
            alert("Error pushing changes.");
        } finally {
            setIsPushing(false);
        }
    };

    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="h-[calc(100vh-64px)] pt-16 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 border-r border-zinc-900 bg-zinc-950 flex flex-col shadow-2xl">
                <div className="p-4 border-b border-zinc-900 bg-zinc-900/20">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Repository</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-200">
                        <Github size={16} className="text-zinc-500" />
                        <span className="text-sm font-bold truncate">{repo}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="mb-2 px-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Files</span>
                    </div>
                    <div className="space-y-0.5">
                        {files.map((f) => (
                            <button 
                                key={f.path} 
                                onClick={() => handleFileSelect(f)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm group ${
                                    selectedFile === f.path 
                                    ? 'bg-zinc-100 text-zinc-950 font-medium' 
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                }`}
                            >
                                <Code2 size={16} className={selectedFile === f.path ? 'text-zinc-950' : 'text-zinc-600 group-hover:text-zinc-400'} />
                                <span className="truncate">{f.name}</span>
                                {f.type === 'dir' && <span className="ml-auto text-[10px] text-zinc-700">DIR</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-[#09090b]">
                {selectedFile ? (
                    <>
                        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-900 bg-zinc-950/50">
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-bold text-zinc-200">{selectedFile}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                            <button 
                                onClick={handlePush}
                                disabled={isPushing}
                                className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPushing ? "Pushing..." : "Push to GitHub"}
                            </button>
                        </div>
                        
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto bg-zinc-950/20">
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="h-4 w-3/4 bg-zinc-900 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-zinc-900 rounded animate-pulse" />
                                    <div className="h-4 w-full bg-zinc-900 rounded animate-pulse" />
                                </div>
                            ) : (
                                <pre className="text-zinc-300 leading-relaxed group">
                                    <code className="block select-text outline-none">{content}</code>
                                </pre>
                            )}
                        </div>

                        {/* AI Input Area */}
                        <div className="p-6 border-t border-zinc-900 bg-zinc-950 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                            <div className="max-w-4xl mx-auto relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                                <div className="relative">
                                    <textarea 
                                        rows={2}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={`Describe changes to ${selectedFile.split('/').pop()}...`}
                                        className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-5 pr-16 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-none shadow-inner"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAgenticAction();
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={handleAgenticAction}
                                        disabled={loading || !prompt}
                                        className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-950 shadow-lg disabled:bg-zinc-800 disabled:text-zinc-600 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {loading ? (
                                            <Cpu size={20} className="animate-spin" />
                                        ) : (
                                            <Wand2 size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/20">
                         <div className="h-24 w-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 shadow-2xl">
                            <Code2 size={40} className="text-zinc-700" />
                         </div>
                         <h3 className="text-xl font-bold text-zinc-400 mb-2">No file selected</h3>
                         <p className="text-sm text-zinc-600">Choose a file from the explorer to begin agentic coding.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const App = () => {
    return (
        <Router>
            <PuterProvider>
                <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-zinc-50/10 selection:text-zinc-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/editor/:owner/:repo" element={<EditorPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </PuterProvider>
        </Router>
    );
};

export default App;