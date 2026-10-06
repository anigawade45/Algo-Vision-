import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  Cpu,
  Wifi,
  Server,
  Settings,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export function Sidebar({
  mobileOpen,
  setMobileOpen,
  isCollapsed = false,
  onToggleCollapse
}) {
  const location = useLocation();
  const { logout } = useAuth();

  const mainNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard' && !location.search,
    },
    {
      name: 'DSA Visualization',
      path: '/dsa',
      icon: Code2,
      active: location.pathname.startsWith('/dsa'),
    },
    {
      name: 'Operating Systems',
      path: '/os',
      icon: Cpu,
      active: location.pathname.startsWith('/os'),
    },
    {
      name: 'Computer Networks',
      path: '/cn',
      icon: Wifi,
      active: location.pathname.startsWith('/cn') || location.pathname.includes('/modules/networks') || location.search.includes('module=networks'),
    },
    {
      name: 'System Design',
      path: '/systemdesign',
      icon: Server,
      active:
        location.pathname.startsWith('/systemdesign') ||
        location.pathname.startsWith('/sysdesign') ||
        location.pathname.includes('/modules/sysdesign') ||
        location.search.includes('module=sysdesign'),
    },
  ];

  const bottomNavItems = [
    {
      name: 'Settings',
      path: '/profile/settings',
      icon: Settings,
      active: location.pathname === '/profile/settings' || location.pathname === '/settings' || location.search.includes('tab=settings'),
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
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white dark:bg-[#0B0F19] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out font-sans ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP: Brand Header & Collapse Toggle */}
        <div className="flex flex-col">
          <div
            className={`h-16 flex items-center border-b border-slate-200/80 dark:border-slate-800/80 transition-all ${
              isCollapsed && !mobileOpen ? 'justify-center px-2' : 'justify-between px-6'
            }`}
          >
            {!isCollapsed || mobileOpen ? (
              <Link
                to="/"
                className="flex items-center gap-3 group"
                onClick={() => setMobileOpen(false)}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
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
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Interactive CS Learning
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                to="/"
                className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 hover:scale-105 transition-transform shrink-0"
                title="AlgoVision Home"
              >
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
              </Link>
            )}

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse/Expand Toggle Button */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Navigation Links List */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
            {/* Core Modules Group */}
            <div>
              {(!isCollapsed || mobileOpen) && (
                <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  Learning Modules
                </div>
              )}

              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      title={isCollapsed && !mobileOpen ? item.name : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                        isCollapsed && !mobileOpen
                          ? 'justify-center p-3'
                          : 'justify-between px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111827] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center gap-3 ${isCollapsed && !mobileOpen ? '' : 'min-w-0'}`}>
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}
                        />
                        {(!isCollapsed || mobileOpen) && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </div>
                    </Link>
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
                title={isCollapsed && !mobileOpen ? item.name : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors ${
                  isCollapsed && !mobileOpen ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                {(!isCollapsed || mobileOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}

          <Link
            to="/"
            onClick={() => {
              logout();
              setMobileOpen(false);
            }}
            title={isCollapsed && !mobileOpen ? 'Logout' : 'Sign out of student session'}
            className={`flex items-center rounded-xl text-[13px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
              isCollapsed && !mobileOpen ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            }`}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 shrink-0" />
              {(!isCollapsed || mobileOpen) && <span>Logout</span>}
            </div>
            {(!isCollapsed || mobileOpen) && (
              <span className="text-[11px] font-mono text-slate-400">Exit</span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}

