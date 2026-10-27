import React from 'react';
import { Link } from 'react-router-dom';
import {
    Server,
    Layers,
    LayoutDashboard,
    ArrowRight,
    Play,
    Lock,
    CheckCircle2,
    Sun,
    Moon
} from 'lucide-react';
import { SYSTEM_DESIGN_TOPICS } from '../data/systemDesignData';

export default function SystemDesignHome({ theme, toggleTheme }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-purple-500 selection:text-white">
            {/* Top Application Navbar */}
            <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <Link to="/systemdesign" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                <Server className="w-4.5 h-4.5" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                AlgoVision SD
                            </span>
                        </Link>

                        <span className="text-slate-300 dark:text-slate-700">/</span>

                        <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                            <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                                Dashboard
                            </Link>
                            <span>/</span>
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                System Design
                            </span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                            </button>
                        )}

                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5 text-purple-500" />
                            <span>Back to Dashboard</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Page Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Module Header Banner */}
                <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-mono font-semibold">
                            <Layers className="w-3.5 h-3.5" />
                            <span>CORE DISTRIBUTED ARCHITECTURE DISCIPLINE</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            System Design &amp; Distributed Architectures
                        </h1>

                        <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                            Explore scalable architectures, client-server data flows, load balancing, distributed caching, database scaling, message queues, and architectural trade-offs through interactive simulations.
                        </p>

                        <div className="pt-2 flex items-center gap-4 text-xs font-mono text-purple-200">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                                1 Active Simulator
                            </span>
                            <span>•</span>
                            <span>8 Architecture Tracks</span>
                        </div>
                    </div>
                </div>

                {/* System Design Modules List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>System Design Topics</span>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                            Select Module
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SYSTEM_DESIGN_TOPICS.map((topic) => (
                            <div
                                key={topic.id}
                                className={`rounded-3xl bg-white dark:bg-[#111827] border p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all duration-200 ${topic.isLive
                                        ? 'border-purple-200 dark:border-purple-800/80 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg'
                                        : 'border-slate-200/80 dark:border-slate-800/80 opacity-80'
                                    }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${topic.badgeColor}`}>
                                            {topic.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {topic.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {topic.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                        <strong className={topic.isLive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}>
                                            {topic.status}
                                        </strong>
                                    </span>

                                    {topic.isLive ? (
                                        <Link
                                            to={topic.path}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-500/20 hover:scale-102 transition-all cursor-pointer"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-white" />
                                            <span>Launch Simulator</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed"
                                        >
                                            <Lock className="w-3.5 h-3.5" />
                                            <span>In Development</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}