import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { PuterProvider, usePuter } from './PuterContext';
import { Terminal, Github, LayoutDashboard, LogOut, Cpu, ChevronRight, Wand2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Octokit } from '@octokit/rest';
import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';

// Replace with your actual GitHub OAuth App Client ID
const GITHUB_CLIENT_ID = "Ov23likt6jD6V9mGfWJ1"; 

const Navbar = () => {
    const { isSignedIn, signOut, user } = usePuter();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020203]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl agent-gradient text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Terminal size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">ENTITY</span>
                </Link>

                <div className="flex items-center space-x-6">
                    {isSignedIn ? (
                        <>
                            <Link 
                                to="/dashboard" 
                                className="flex items-center space-x-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                            >
                                <LayoutDashboard size={18} />
                                <span className="hidden sm:inline">Workspace</span>
                            </Link>
                            <div className="flex items-center space-x-4 pl-4 border-l border-white/5">
                                <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                                    {user?.username}
                                </span>
                                <button 
                                    onClick={signOut}
                                    className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button 
                            className="px-5 py-2.5 rounded-xl agent-gradient text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
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
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-8">
                    <Sparkles size={12} />
                    Agentic Coding Reinvented
                </div>
                <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                    Code with <br/> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Pure Intelligence.</span>
                </h1>
                <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                    ENTITY is the next-generation agentic IDE. Built on Puter.js, 
                    it understands your entire repository and executes changes autonomously.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={signIn}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl agent-gradient text-white font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
                    >
                        Launch Workstation
                    </button>
                    <a 
                        href="https://github.com/soumyadipkarforma/entity"
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                    >
                        <Github size={20} />
                        GitHub
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

const Dashboard = () => {
    const { isSignedIn } = usePuter();
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ghToken, setGhToken] = useState<string | null>(null);
    const [verification, setVerification] = useState<any>(null);

    const fetchRepos = async (token: string) => {
        setLoading(true);
        try {
            const octokit = new Octokit({ auth: token });
            const { data } = await octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 12 });
            setRepos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSignedIn) {
            const storedToken = sessionStorage.getItem('gh_token');
            if (storedToken) {
                setGhToken(storedToken);
                fetchRepos(storedToken);
            } else {
                setLoading(false);
            }
        }
    }, [isSignedIn]);

    const startDeviceFlow = async () => {
        setLoading(true);
        try {
            const auth = createOAuthDeviceAuth({
                clientType: "oauth-app",
                clientId: GITHUB_CLIENT_ID,
                scopes: ["repo", "user"],
                onVerification(v) {
                    setVerification(v);
                    setLoading(false);
                },
            });

            const authentication = await auth({ type: "oauth" });
            sessionStorage.setItem('gh_token', authentication.token);
            setGhToken(authentication.token);
            setVerification(null);
            fetchRepos(authentication.token);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
            <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-2">Workspaces</h2>
                    <p className="text-zinc-500 font-medium">Select a repository to start agentic development.</p>
                </div>
                {!ghToken && !verification && (
                    <button 
                        onClick={startDeviceFlow}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all"
                    >
                        <Github size={16} />
                        Connect GitHub
                    </button>
                )}
            </header>

            {verification && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 p-8 rounded-3xl glass glow-border">
                    <h3 className="text-xl font-black mb-4">Device Authorization Required</h3>
                    <p className="text-zinc-400 mb-6">
                        Please visit <a href={verification.verification_uri} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{verification.verification_uri}</a> and enter the code:
                    </p>
                    <div className="text-4xl font-black tracking-widest text-white bg-black/40 p-6 rounded-2xl border border-white/10 text-center mb-6">
                        {verification.user_code}
                    </div>
                    <p className="text-xs text-zinc-500 animate-pulse">Waiting for authorization...</p>
                </motion.div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-60 rounded-3xl glass animate-pulse" />)}
                </div>
            ) : ghToken ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {repos.map((repo) => (
                        <motion.div 
                            key={repo.id}
                            whileHover={{ y: -5 }}
                            className="group p-8 rounded-3xl glass flex flex-col justify-between hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <Github size={24} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-1 px-3 rounded-full bg-black/40 border border-white/5">
                                        {repo.private ? 'Private' : 'Public'}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black mb-2 group-hover:text-indigo-400 transition-colors truncate">{repo.name}</h3>
                                <p className="text-sm text-zinc-500 font-medium line-clamp-2 mb-8">{repo.description || "Experimental repository ready for intelligence."}</p>
                            </div>
                            <Link 
                                to={`/editor/${repo.owner.login}/${repo.name}`}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs text-center shadow-xl shadow-black/20"
                            >
                                Open Workstation
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : !verification && (
                <div className="flex flex-col items-center justify-center py-20 rounded-[40px] border-2 border-dashed border-white/5 bg-white/5">
                    <p className="text-zinc-500 font-bold mb-4">No GitHub account connected.</p>
                    <button onClick={startDeviceFlow} className="px-8 py-4 rounded-2xl agent-gradient text-white font-black uppercase tracking-widest text-xs">Connect Now</button>
                </div>
            )}
        </div>
    );
};

const EditorPage = () => {
    const { owner, repo } = useParams();
    const { isSignedIn, ai } = usePuter();
    const [prompt, setPrompt] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isPushing, setIsPushing] = useState(false);
    const [ghToken, setGhToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<{role: 'user' | 'agent', content: string, plan?: string}[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stagedChanges, setStagedChanges] = useState<Record<string, string>>({});

    useEffect(() => {
        const token = sessionStorage.getItem('gh_token');
        if (token) setGhToken(token);
    }, []);

    useEffect(() => {
        if (owner && repo && ghToken) {
            const octokit = new Octokit({ auth: ghToken });
            octokit.repos.getContent({ owner, repo, path: '' })
                .then(({ data }: any) => setFiles(Array.isArray(data) ? data : []))
                .catch(console.error);
        }
    }, [owner, repo, ghToken]);

    const handleFileSelect = async (file: any) => {
        if (file.type === 'dir') return;
        setSelectedFile(file.path);
        if (stagedChanges[file.path]) {
            setContent(stagedChanges[file.path]);
            return;
        }
        setLoading(true);
        try {
            const octokit = new Octokit({ auth: ghToken! });
            const { data }: any = await octokit.repos.getContent({ owner: owner!, repo: repo!, path: file.path });
            setContent(atob(data.content));
        } catch (e) {
            console.error(e);
            setContent("Error reading module.");
        } finally {
            setLoading(false);
        }
    };

    const handleAgenticAction = async () => {
        if (!prompt) return;
        const userMsg = prompt;
        setPrompt("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const fileContext = files.map(f => f.name).join(', ');
            const systemPrompt = `You are ENTITY, an autonomous browser-based developer.
You modify the repository: ${owner}/${repo} using TOOLS.
NEVER ask the user to select files. Execute changes directly using write_file().

TOOLS:
1. write_file(path, content): Create/Overwrites file.
2. list_files(): List repository entries.

SYNTAX:
<tool_call>
tool_name: name
args: { "arg1": "val" }
</tool_call>

Response:
THOUGHT: Plan
TOOL_CALL (Optional)
RESPONSE: Final message.`;

            const fullPrompt = `${systemPrompt}\n\nFILES: ${fileContext}\nACTIVE: ${selectedFile || 'None'}\n\nUSER: ${userMsg}`;
            const result = await ai.chat(fullPrompt);
            const responseText = result.toString();

            const toolCallRegex = /<tool_call>([\s\S]*?)<\/tool_call>/g;
            let match;
            const newStaged = { ...stagedChanges };
            let toolLogs: string[] = [];

            while ((match = toolCallRegex.exec(responseText)) !== null) {
                const callBlock = match[1].trim();
                const name = callBlock.match(/tool_name:\s*(.*)/)?.[1].trim();
                const argsRaw = callBlock.match(/args:\s*({[\s\S]*})/)?.[1];

                if (name === 'write_file' && argsRaw) {
                    try {
                        const args = JSON.parse(argsRaw);
                        newStaged[args.path] = args.content;
                        toolLogs.push(`MODIFIED: ${args.path}`);
                        if (args.path === selectedFile) setContent(args.content);
                    } catch (e) { console.error(e); }
                }
            }

            if (Object.keys(newStaged).length > 0) setStagedChanges(newStaged);

            const thought = responseText.match(/THOUGHT:([\s\S]*?)(?=<tool_call>|RESPONSE:|$)/)?.[1].trim();
            const response = responseText.match(/RESPONSE:([\s\S]*?)$/)?.[1].trim();

            setMessages(prev => [...prev, { 
                role: 'agent', 
                content: response || (toolLogs.length > 0 ? "Modifications applied." : "Task processed."),
                plan: thought
            }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'agent', content: "Intelligence core offline." }]);
        } finally {
            setLoading(false);
        }
    };

    const handlePushAll = async () => {
        if (!Object.keys(stagedChanges).length || !ghToken) return;
        setIsPushing(true);
        try {
            const octokit = new Octokit({ auth: ghToken });
            const coAuth = "\n\nCo-authored-by: ENTITY <entity@heyputer.com>";
            
            for (const [path, newCode] of Object.entries(stagedChanges)) {
                let sha;
                try {
                    const { data }: any = await octokit.repos.getContent({ owner: owner!, repo: repo!, path });
                    sha = data.sha;
                } catch (e) {}

                await octokit.repos.createOrUpdateFileContents({
                    owner: owner!, repo: repo!, path,
                    message: `[ENTITY] Autonomous update to ${path}${coAuth}`,
                    content: btoa(newCode),
                    sha
                });
            }
            setStagedChanges({});
            alert("Intelligence synced with repository.");
        } catch (e) {
            console.error(e);
            alert("Sync failed.");
        } finally {
            setIsPushing(false);
        }
    };

    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="h-screen pt-16 flex flex-col md:flex-row overflow-hidden bg-[#020203]">
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-40">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Repository Modules</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-600 hover:text-white transition-colors"><ChevronRight className="rotate-180" size={18} /></button>
                        </div>
                        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                            {files.map(f => (
                                <button key={f.path} onClick={() => handleFileSelect(f)} className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center justify-between ${selectedFile === f.path ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:bg-white/5'}`}>
                                    <span className="truncate">{f.name}</span>
                                    {stagedChanges[f.path] && <div className="h-1.5 w-1.5 rounded-full bg-white shadow-lg" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <div className="flex-1 flex flex-col p-4 sm:p-8">
                    <div className="flex-1 glass rounded-[40px] overflow-hidden flex flex-col border border-white/10 shadow-2xl relative">
                        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-4">
                                {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-500 hover:text-white transition-colors"><ChevronRight size={18} /></button>}
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Intelligence Node</span>
                                    <span className="text-sm font-bold text-white">{selectedFile || owner+'/'+repo}</span>
                                </div>
                            </div>
                            {Object.keys(stagedChanges).length > 0 && (
                                <button onClick={handlePushAll} disabled={isPushing} className="px-6 py-2 rounded-xl agent-gradient text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                                    {isPushing ? 'Syncing...' : `Push ${Object.keys(stagedChanges).length} Staged Changes`}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-auto p-8 font-mono text-sm text-zinc-400 bg-[#050507]">
                            {loading ? <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-4 w-full bg-white/5 rounded-full animate-pulse" />)}</div> : <pre className="leading-relaxed"><code>{content || '// Workstation initialized. Start chatting with ENTITY.'}</code></pre>}
                        </div>
                    </div>
                </div>

                <div className="h-[400px] glass m-4 sm:m-8 mt-0 rounded-[40px] flex flex-col border border-white/10 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-500/5 -z-10" />
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {messages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2"><Cpu size={32} className="opacity-20"/><p className="text-xs font-black uppercase tracking-widest">Awaiting Instructions</p></div>}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] px-6 py-4 rounded-[30px] text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 font-medium' : 'bg-white/5 border border-white/10 text-zinc-300'}`}>
                                    {m.content}
                                </div>
                                {m.plan && <div className="mt-3 ml-4 p-4 rounded-3xl bg-black/40 border border-white/5 text-[11px] text-zinc-500 max-w-[80%] font-mono leading-relaxed"><span className="text-indigo-400 font-bold uppercase tracking-tighter mr-2">Logic Path:</span>{m.plan}</div>}
                            </div>
                        ))}
                        {loading && <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-tighter text-[10px] animate-pulse"><div className="h-2 w-2 rounded-full agent-gradient shadow-lg" />Processing Request...</div>}
                    </div>
                    <div className="p-8 border-t border-white/5 bg-black/20">
                        <div className="relative glow-border rounded-2xl">
                            <input 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAgenticAction()}
                                placeholder="Enter developer instructions..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none transition-all pr-20 placeholder:text-zinc-700"
                            />
                            <button onClick={handleAgenticAction} disabled={loading || !prompt} className="absolute right-2 top-2 h-11 w-11 rounded-xl agent-gradient text-white shadow-xl shadow-indigo-500/40 hover:scale-105 transition-all flex items-center justify-center">
                                <Wand2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <PuterProvider>
                <div className="min-h-screen bg-[#020203] text-zinc-50 selection:bg-indigo-500/30 selection:text-white">
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
