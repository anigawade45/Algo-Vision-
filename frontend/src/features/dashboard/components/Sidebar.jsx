import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Binary,
  Cpu,
  Wifi,
  Server,
  TrendingUp,
  HelpCircle,
  Bot,
  FileText,
  Settings,
  LogOut,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { studentProfile } from '../data/mockDashboardData';

export function Sidebar({ mobileOpen, setMobileOpen, onOpenAiMentor, onOpenVisualizer }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const userName = user?.name || studentProfile.name;
  const userInitials = userName ? userName.substring(0, 2).toUpperCase() : 'ST';

  const mainNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard' && !location.search,
      badge: null,
    },
    {
      name: 'DSA Visualization',
      path: '/dsa',
      icon: Binary,
      active: location.pathname.startsWith('/dsa'),
      badge: null,
    },
    {
      name: 'Operating Systems',
      path: '/os',
      icon: Cpu,
      active: location.pathname.startsWith('/os'),
      badge: null,
    },
    {
      name: 'Computer Networks',
      path: '/cn',
      icon: Wifi,
      active: location.pathname.startsWith('/cn') || location.pathname.includes('/modules/networks') || location.search.includes('module=networks'),
      badge: null,
    },
    {
      name: 'System Design',
      path: '/modules/sysdesign',
      icon: Server,
      active: location.pathname.includes('/modules/sysdesign') || location.search.includes('module=sysdesign'),
      badge: null,
    },
  ];

  const toolsNavItems = [
    {
      name: 'Progress',
      path: '/dashboard?tab=progress',
      icon: TrendingUp,
      active: location.search.includes('tab=progress'),
    },
    {
      name: 'AI Mentor',
      path: '#ai-mentor',
      icon: Bot,
      active: false,
      badge: 'GPT-4o',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      isSpecial: true,
      action: (e) => {
        e?.preventDefault();
        onOpenAiMentor && onOpenAiMentor();
      },
    },
    {
      name: 'My Notes',
      path: '/dashboard?tab=notes',
      icon: FileText,
      active: location.search.includes('tab=notes'),
    },
  ];

  const bottomNavItems = [
    {
      name: 'Settings',
      path: '/dashboard?tab=settings',
      icon: Settings,
      active: location.search.includes('tab=settings'),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#0B0F19] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out font-sans ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* TOP: Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800/80">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="7" height="7" rx="1.5" />
                  <rect x="15" y="3" width="7" height="7" rx="1.5" />
                  <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
                  <path d="M5.5 10v2a2 2 0 0 0 2 2h4.5" />
                  <path d="M18.5 10v2a2 2 0 0 1-2 2h-4.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  AlgoVision
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    B.Tech
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Interactive CS Learning
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
            {/* Core Modules Group */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Learning Modules
              </div>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={(e) => {
                        if (item.action) {
                          item.action(e);
                        }
                        setMobileOpen(false);
                      }}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111827] hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive
                              ? 'text-white'
                              : 'text-slate-400 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : item.badgeColor
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Tools & Practice Group */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Study Tools & AI
              </div>
              <nav className="space-y-1">
                {toolsNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;

                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={(e) => {
                        if (item.action) {
                          item.action(e);
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${isActive
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : item.isSpecial
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/60 dark:border-blue-500/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111827] hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive
                              ? 'text-white'
                              : item.isSpecial
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-400 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : item.badgeColor
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* BOTTOM: Student Profile Card & Logout */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <Link
            to="/"
            onClick={() => {
              logout();
              setMobileOpen(false);
            }}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Sign out of student session"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Exit</span>
          </Link>

          {/* Student Profile Quick View */}
          <div className="pt-2 px-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/20 shadow-xs shrink-0">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {userName}
              </span>
              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || studentProfile.rollNo}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
