import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { PuterProvider, usePuter } from './PuterContext';
import { Terminal, Github, LayoutDashboard, LogOut, Cpu, ChevronRight, Wand2, Sparkles, Layers, Box, Globe, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Octokit } from '@octokit/rest';

const GITHUB_CLIENT_ID = "Ov23likt6jD6V9mGfWJ1"; 

const Navbar = () => {
    const { isSignedIn, signOut, user } = usePuter();
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020203]/60 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl agent-gradient text-white shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-all duration-500">
                        <Terminal size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">ENTITY</span>
                </Link>
                <div className="flex items-center space-x-8">
                    {isSignedIn ? (
                        <>
                            <Link to="/dashboard" className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                                <LayoutDashboard size={18} />
                                <span className="hidden sm:inline">Modules</span>
                            </Link>
                            <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Authenticated</span>
                                    <span className="text-xs font-bold text-indigo-400">{user?.username}</span>
                                </div>
                                <button onClick={signOut} className="p-2.5 rounded-2xl bg-white/5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"><LogOut size={18} /></button>
                            </div>
                        </>
                    ) : (
                        <button className="px-6 py-2.5 rounded-2xl agent-gradient text-white text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Initialize</button>
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
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="max-w-5xl text-center relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-10 shadow-2xl">
                    <Sparkles size={14} /> Neural Development Interface
                </div>
                <h1 className="text-7xl sm:text-9xl font-black tracking-tighter mb-10 leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-700">
                    Agentic <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Autonomous</span><br/> Coding.
                </h1>
                <p className="text-xl text-zinc-500 mb-16 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">ENTITY is an optimized browser-side AI engine. It manages V86 Virtual Machines, local SQLite storage, and direct GitHub CI orchestration.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button onClick={signIn} className="w-full sm:w-auto px-10 py-5 rounded-3xl agent-gradient text-white font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">Launch Kernel <ChevronRight size={20} /></button>
                    <a href="https://github.com/soumyadipkarforma/entity" className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"><Github size={20} /> Source</a>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { isSignedIn } = usePuter();
    const [repos, setRepos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ghToken, setGhToken] = useState<string | null>(null);
    const [verification, setVerification] = useState<any>(null);
    const [showPatInput, setShowPatInput] = useState(false);
    const [patValue, setPatInput] = useState("");

    const fetchRepos = async (token: string) => {
        setIsLoading(true);
        try {
            const octokit = new Octokit({ auth: token });
            const { data } = await octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 9 });
            setRepos(data);
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (isSignedIn) {
            const storedToken = sessionStorage.getItem('gh_token');
            if (storedToken) { setGhToken(storedToken); fetchRepos(storedToken); } 
            else { setIsLoading(false); }
        }
    }, [isSignedIn]);

    const handleSavePat = async () => {
        if (!patValue) return;
        sessionStorage.setItem('gh_token', patValue);
        setGhToken(patValue);
        setShowPatInput(false);
        fetchRepos(patValue);
    };

    const startGitHubAuth = async () => {
        setIsLoading(true);
        try {
            const response = await window.puter.auth.signIn();
            if (response) {
                const storedToken = sessionStorage.getItem('gh_token');
                if (storedToken) { fetchRepos(storedToken); } 
                else { setShowPatInput(true); }
            }
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const startDeviceFlow = async () => {
        setIsLoading(true);
        setVerification(null);
        try {
            const primaryProxy = "https://corsproxy.io/?";
            const backupProxy = "https://api.allorigins.win/raw?url=";
            let res = await fetch(`${primaryProxy}https://github.com/login/device/code`, {
                method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, scope: "repo user" })
            });
            if (!res.ok) {
                res = await fetch(`${backupProxy}${encodeURIComponent('https://github.com/login/device/code')}`, {
                    method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, scope: "repo user" })
                });
            }
            const data = await res.json();
            if (!data.user_code) throw new Error("Handshake failed.");
            setVerification(data);
            setIsLoading(false);
            const pollInterval = setInterval(async () => {
                try {
                    const pollRes = await fetch(`${primaryProxy}https://github.com/login/oauth/access_token`, {
                        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
                        body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, device_code: data.device_code, grant_type: "urn:ietf:params:oauth:grant-type:device_code" })
                    });
                    const pollData = await pollRes.json();
                    if (pollData.access_token) {
                        clearInterval(pollInterval);
                        sessionStorage.setItem('gh_token', pollData.access_token);
                        setGhToken(pollData.access_token);
                        setVerification(null);
                        fetchRepos(pollData.access_token);
                    } else if (pollData.error && pollData.error !== "authorization_pending") {
                        clearInterval(pollInterval);
                        setIsLoading(false);
                        setVerification(null);
                    }
                } catch (e) { console.error(e); }
            }, (data.interval || 5) * 1000);
        } catch (e) { console.error(e); setIsLoading(false); }
    };

    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="pt-32 px-8 max-w-7xl mx-auto pb-20">
            <header className="mb-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter mb-3">Workspaces</h2>
                    <div className="flex items-center gap-4 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                        <span className="flex items-center gap-1.5 text-emerald-500"><Globe size={12}/> Cloud Active</span>
                        <span className="flex items-center gap-1.5"><Layers size={12}/> {repos.length} Modules</span>
                    </div>
                </div>
                {!ghToken && (
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowPatInput(!showPatInput)} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">{showPatInput ? 'Cancel' : 'Manual PAT'}</button>
                        <button onClick={startGitHubAuth} className="flex items-center gap-3 px-8 py-4 rounded-2xl agent-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"><Github size={18} /> Connect GitHub</button>
                    </div>
                )}
            </header>

            {showPatInput && !ghToken && (
                <div className="mb-20 p-12 rounded-[40px] glass glow-border">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400"><ShieldCheck size={20} /></div>
                        <h3 className="text-2xl font-black tracking-tight text-white">Secure Link Required</h3>
                    </div>
                    <p className="text-zinc-400 text-sm mb-10 leading-relaxed max-w-2xl">Provide a GitHub Personal Access Token with repo permissions. This token is stored only in your session.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="password" value={patValue} onChange={(e) => setPatInput(e.target.value)} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-indigo-500 transition-all tracking-widest text-white" />
                        <button onClick={handleSavePat} className="px-10 py-5 rounded-2xl agent-gradient text-white font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">Authorize Node</button>
                    </div>
                </div>
            )}

            {verification && (
                <div className="mb-20 p-12 rounded-[40px] glass glow-border text-center">
                    <h3 className="text-2xl font-black mb-6 tracking-tight text-white">Neural Handshake Required</h3>
                    <div className="text-6xl font-black tracking-[0.3em] text-indigo-400 bg-black/60 py-10 rounded-3xl border border-white/5 shadow-inner mb-10">{verification.user_code}</div>
                    <button onClick={() => window.open(verification.verification_uri || 'https://github.com/login/device', '_blank')} className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] bg-white/10 px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">Open GitHub Portal <Globe size={14}/></button>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 rounded-[40px] glass animate-pulse shimmer" />)}
                </div>
            ) : ghToken ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {repos.map((repo) => (
                        <div key={repo.id} className="group p-10 rounded-[40px] glass flex flex-col justify-between hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 agent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div>
                                <div className="flex items-center justify-between mb-10">
                                    <div className="h-14 w-14 rounded-2xl agent-gradient flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500"><Box size={28} /></div>
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 py-1.5 px-4 rounded-full bg-black/40 border border-white/10"><ShieldCheck size={12} className="text-indigo-400"/> {repo.private ? 'Secured' : 'Open'}</div>
                                </div>
                                <h3 className="text-2xl font-black mb-3 tracking-tighter group-hover:text-indigo-400 transition-colors truncate">{repo.name}</h3>
                                <p className="text-sm text-zinc-500 font-medium line-clamp-2 leading-relaxed mb-10">{repo.description || "Intelligence-ready repository container."}</p>
                            </div>
                            <Link to={`/editor/${repo.owner.login}/${repo.name}`} className="w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] text-center shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Initialize Workstation</Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 rounded-[60px] border-2 border-dashed border-white/10 bg-white/5">
                    <Github size={48} className="text-zinc-700 mb-8" />
                    <p className="text-zinc-500 font-black uppercase tracking-widest text-xs mb-10">Neural connection not established.</p>
                    <button onClick={startDeviceFlow} className="px-12 py-5 rounded-3xl agent-gradient text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Connect Entity</button>
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
    const [isBusy, setIsBusy] = useState(false);
    const [isPushing, setIsPushing] = useState(false);
    const [ghToken, setGhToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<{role: 'user' | 'agent', content: string, plan?: string}[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stagedChanges, setStagedChanges] = useState<Record<string, string>>({});
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('gh_token');
        if (token) setGhToken(token);
    }, []);

    const fetchFiles = async () => {
        if (!owner || !repo || !ghToken) return;
        try {
            const octokit = new Octokit({ auth: ghToken });
            const { data } = await octokit.repos.getContent({ owner, repo, path: '' });
            setFiles(Array.isArray(data) ? data : []);
        } catch (e) { console.error("Explorer sync failed", e); }
    };

    useEffect(() => { fetchFiles(); }, [owner, repo, ghToken]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isBusy]);

    const handleFileSelect = async (file: any) => {
        if (file.type === 'dir') return;
        setSelectedFile(file.path);
        if (stagedChanges[file.path]) { setContent(stagedChanges[file.path]); return; }
        setIsBusy(true);
        try {
            const octokit = new Octokit({ auth: ghToken! });
            const { data }: any = await octokit.repos.getContent({ owner: owner!, repo: repo!, path: file.path });
            setContent(atob(data.content));
        } catch (e) { setContent("// Failed to decrypt module."); } finally { setIsBusy(false); }
    };

    const handleAgenticAction = async () => {
        if (!prompt) return;
        const userMsg = prompt;
        setPrompt("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsBusy(true);
        try {
            const fileContext = files.map(f => f.name).join(', ');
            const systemPrompt = `You are ENTITY, an autonomous dev engine. Use TOOLS for repo ${owner}/${repo}. Format: THOUGHT, TOOL_CALL: { "tool": "writeFile", "args": { "path": "fn.ext", "content": "data" } }, RESPONSE. Tools: writeFile, readFile, listDir. Files: ${fileContext}. Active: ${selectedFile || 'None'}`;
            const result = await ai.chat(`${systemPrompt}\n\nUSER: ${userMsg}`);
            const responseText = result.toString();
            const thought = responseText.match(/THOUGHT:([\s\S]*?)(?=TOOL_CALL:|RESPONSE:|$)/)?.[1].trim();
            const response = responseText.match(/RESPONSE:([\s\S]*?)$/)?.[1].trim();
            const toolCallBlock = responseText.match(/TOOL_CALL:\s*({[\s\S]*?})/);
            let toolApplied = false;
            if (toolCallBlock) {
                try {
                    const call = JSON.parse(toolCallBlock[1].trim());
                    if (call.tool === 'writeFile' && call.args.path) {
                        const newStaged = { ...stagedChanges };
                        newStaged[call.args.path] = call.args.content;
                        setStagedChanges(newStaged);
                        if (call.args.path === selectedFile) setContent(call.args.content);
                        toolApplied = true;
                        if (!files.find(f => f.name === call.args.path)) setTimeout(fetchFiles, 1000);
                    }
                } catch (e) { console.error(e); }
            }
            setMessages(prev => [...prev, { role: 'agent', content: response || (toolApplied ? "Neural cycle complete." : responseText), plan: thought }]);
        } catch (e) { setMessages(prev => [...prev, { role: 'agent', content: "Neural handshake timed out." }]); } finally { setIsBusy(false); }
    };

    const handlePushAll = async () => {
        if (!Object.keys(stagedChanges).length || !ghToken) return;
        setIsPushing(true);
        try {
            const octokit = new Octokit({ auth: ghToken });
            const coAuth = "\n\nCo-authored-by: ENTITY <entity@heyputer.com>";
            for (const [path, newCode] of Object.entries(stagedChanges)) {
                let sha;
                try { const { data }: any = await octokit.repos.getContent({ owner: owner!, repo: repo!, path }); sha = data.sha; } catch (e) {}
                await octokit.repos.createOrUpdateFileContents({ owner: owner!, repo: repo!, path, message: `[ENTITY] Autonomous update: ${path}${coAuth}`, content: btoa(newCode), sha });
            }
            setStagedChanges({});
            alert("Repository synchronized.");
        } catch (e) { alert("Sync failed."); } finally { setIsPushing(false); }
    };

    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="h-screen pt-16 flex flex-col md:flex-row overflow-hidden bg-[#020203]">
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div initial={{ x: -350 }} animate={{ x: 0 }} exit={{ x: -350 }} className="w-80 border-r border-white/5 bg-black/60 backdrop-blur-3xl z-40">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex flex-col"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Architecture</span><span className="text-xs font-bold text-white uppercase tracking-tighter">Repository Modules</span></div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"><ChevronRight className="rotate-180" size={18} /></button>
                        </div>
                        <div className="p-6 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
                            {files.map(f => (
                                <button key={f.path} onClick={() => handleFileSelect(f)} className={`w-full text-left px-5 py-4 rounded-3xl text-sm transition-all flex items-center justify-between group ${selectedFile === f.path ? 'agent-gradient text-white shadow-xl' : 'text-zinc-500 hover:bg-white/5'}`}>
                                    <span className="truncate font-bold tracking-tight">{f.name}</span>
                                    {stagedChanges[f.path] ? <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_white]" /> : <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <div className="flex-1 flex flex-col p-6 sm:p-10">
                    <div className="flex-1 glass rounded-[50px] overflow-hidden flex flex-col border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                        <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-6">
                                {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-2xl bg-white/5 text-zinc-500 hover:text-white transition-all"><ChevronRight size={20} /></button>}
                                <div className="flex flex-col"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Neural Node</span><span className="text-sm font-bold text-white tracking-tight uppercase">{selectedFile || owner+'/'+repo}</span></div>
                            </div>
                            {Object.keys(stagedChanges).length > 0 && <button onClick={handlePushAll} disabled={isPushing} className="px-8 py-3 rounded-2xl agent-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">{isPushing ? 'Decrypting...' : `Commit ${Object.keys(stagedChanges).length} Cycles`}</button>}
                        </div>
                        <div className="flex-1 overflow-auto p-10 font-mono text-sm text-zinc-400 bg-[#040406]/80 selection:bg-indigo-500/20">{isBusy ? <div className="space-y-6">{[1,2,3,4].map(i => <div key={i} className="h-4 w-full bg-white/5 rounded-full animate-pulse shimmer" />)}</div> : <pre className="leading-relaxed"><code>{content || '// Interface initialized. Neural connection stable.'}</code></pre>}</div>
                    </div>
                </div>

                <div className="h-[450px] glass mx-6 sm:mx-10 mb-10 rounded-[50px] flex flex-col border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden relative group">
                    <div className="absolute inset-0 agent-gradient opacity-[0.03] pointer-events-none" />
                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                        {messages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4 opacity-40"><Cpu size={48} strokeWidth={1} className="animate-pulse"/><p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Instruction</p></div>}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] px-8 py-5 rounded-[35px] text-sm leading-relaxed tracking-tight ${m.role === 'user' ? 'agent-gradient text-white shadow-2xl font-bold' : 'bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-xl'}`}>{m.content}</div>
                                {m.plan && <div className="mt-4 ml-6 p-5 rounded-[30px] bg-black/60 border border-white/5 text-[11px] text-zinc-500 max-w-[75%] font-mono leading-relaxed shadow-inner"><div className="flex items-center gap-2 mb-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" /><span className="text-indigo-400 font-black uppercase tracking-widest text-[9px]">Neural Path</span></div>{m.plan}</div>}
                            </div>
                        ))}
                        {isBusy && <div className="flex items-center gap-4 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse"><div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" /><div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce delay-75" /><div className="h-2 w-2 rounded-full bg-pink-500 animate-bounce delay-150" /></div>Synchronizing Intelligence</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-10 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
                        <div className="relative glow-border rounded-3xl">
                            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAgenticAction()} placeholder="Transmit instruction packet..." className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none transition-all pr-24 placeholder:text-zinc-700 tracking-tight text-white font-medium" />
                            <button onClick={handleAgenticAction} disabled={isBusy || !prompt} className="absolute right-3 top-3 h-14 w-14 rounded-2xl agent-gradient text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"><Wand2 size={24} /></button>
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
                <div className="min-h-screen bg-[#020203] text-zinc-50 selection:bg-indigo-500/40 selection:text-white overflow-x-hidden">
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