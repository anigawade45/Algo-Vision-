import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ChevronRight,
  Terminal,
  Sun,
  Moon,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  FolderCode,
  Search,
  Loader2,
  FileCode2,
} from 'lucide-react';
import { getMyProblems, getProblems } from '@/api/dsa.api';

/**
 * Extracts the canonical problem identifier (preferring slug)
 */
const getProblemId = (problem) =>
  problem?.slug ||
  problem?.problemId ||
  problem?.id ||
  problem?._id;

/**
 * Shared Search Results Dropdown Component for Desktop & Mobile
 */
function SearchDropdown({
  isSearching,
  searchQuery,
  searchResults,
  hasError,
  onRetry,
  onSelectProblem,
  getDifficultyPill,
}) {
  if (isSearching) {
    return (
      <div className="p-4 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <span>Searching problems...</span>
      </div>
    );
  }

  if (hasError && searchResults.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono space-y-2">
        <p>Could not load problem catalog.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[11px] font-semibold border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
        No matching problems found for "{searchQuery}"
      </div>
    );
  }

  return (
    <div id="dsa-search-results" role="listbox" className="space-y-1">
      {searchResults.map((p) => {
        const pId = getProblemId(p);
        return (
          <button
            key={pId}
            type="button"
            role="option"
            aria-selected="false"
            onClick={() => onSelectProblem(p)}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111827] flex items-center justify-between gap-3 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode2 className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {p.title}
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {p.category || 'General'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {p.isUserProblem && (
                <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/50">
                  My Upload
                </span>
              )}
              <span
                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getDifficultyPill(
                  p.difficulty
                )}`}
              >
                {p.difficulty || 'Medium'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function DsaNavbar({
  theme,
  toggleTheme,
  onNavigateToLanding,
  onNavigateToHome,
  onNavigateToSubmit,
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allSearchableProblems, setAllSearchableProblems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch problems for live search bar
  const loadSearchableProblems = async () => {
    try {
      setIsSearching(true);
      setLoadError(false);
      const [myRes, catRes] = await Promise.allSettled([getMyProblems(), getProblems()]);

      const bothFailed = myRes.status === 'rejected' && catRes.status === 'rejected';
      if (bothFailed) {
        setLoadError(true);
      }

      let combined = [];
      const seenIds = new Set();

      if (
        myRes.status === 'fulfilled' &&
        myRes.value?.success &&
        Array.isArray(myRes.value?.data?.problems)
      ) {
        myRes.value.data.problems.forEach((p) => {
          const pId = getProblemId(p);
          if (pId && !seenIds.has(pId)) {
            seenIds.add(pId);
            combined.push({ ...p, isUserProblem: true });
          }
        });
      }

      if (
        catRes.status === 'fulfilled' &&
        catRes.value?.success &&
        Array.isArray(catRes.value?.data?.problems)
      ) {
        catRes.value.data.problems.forEach((p) => {
          const pId = getProblemId(p);
          if (pId && !seenIds.has(pId)) {
            seenIds.add(pId);
            combined.push(p);
          }
        });
      }

      setAllSearchableProblems(combined);
    } catch (err) {
      console.error('Error loading search problems:', err);
      setLoadError(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadSearchableProblems();
  }, []);

  // Filter problems based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const filtered = allSearchableProblems.filter((p) => {
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const catMatch = (p.category || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const tagsMatch =
        Array.isArray(p.tags) &&
        p.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
      return titleMatch || catMatch || descMatch || tagsMatch;
    });

    setSearchResults(filtered);
  }, [searchQuery, allSearchableProblems]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProblem = (problem) => {
    const problemId = getProblemId(problem);
    if (!problemId) {
      console.error('Cannot navigate: problem identifier is missing.', problem);
      return;
    }

    navigate(`/dsa/workspace/${encodeURIComponent(problemId)}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const getDifficultyPill = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
      case 'hard':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60';
      default:
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
    }
  };

  return (
    <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 cursor-pointer group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="AlgoVision Home"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Terminal className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              AlgoVision
            </span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" aria-hidden="true" />

          {/* Desktop Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb navigation">
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              AlgoVision
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={onNavigateToHome || onNavigateToLanding}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              DSA
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold" aria-current="page">
              Home
            </span>
          </nav>
        </div>

        {/* Center: Desktop DSA Problem Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              aria-label="Search DSA problems"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search DSA problems by title, tag, or category..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Floating Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto p-1 space-y-1">
              <SearchDropdown
                isSearching={isSearching}
                searchQuery={searchQuery}
                searchResults={searchResults}
                hasError={loadError}
                onRetry={loadSearchableProblems}
                onSelectProblem={handleSelectProblem}
                getDifficultyPill={getDifficultyPill}
              />
            </div>
          )}
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/dsa/my-problems"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer min-h-10"
          >
            <FolderCode className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span>My Problems</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer min-h-10"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>

          {onNavigateToSubmit && (
            <button
              type="button"
              onClick={onNavigateToSubmit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer min-h-10"
            >
              <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>New Problem</span>
            </button>
          )}

          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer min-w-10 min-h-10 flex items-center justify-center"
              title="Toggle theme mode"
              aria-label="Toggle light and dark theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              )}
            </button>
          )}

          <div
            className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-slate-200 dark:ring-slate-800 cursor-pointer"
            role="img"
            aria-label="User avatar"
          >
            <User className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Mobile Right Controls */}
        <div className="flex sm:hidden items-center gap-2">
          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-w-11 min-h-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              aria-label="Toggle light and dark theme mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#161F33] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1E2638] min-w-11 min-h-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] px-4 py-4 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Input & Dropdown */}
          <div className="relative space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                aria-label="Search DSA problems"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search DSA problems by title, tag, or category..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchQuery.trim() && (
              <div className="bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-1 max-h-60 overflow-y-auto">
                <SearchDropdown
                  isSearching={isSearching}
                  searchQuery={searchQuery}
                  searchResults={searchResults}
                  hasError={loadError}
                  onRetry={loadSearchableProblems}
                  onSelectProblem={handleSelectProblem}
                  getDifficultyPill={getDifficultyPill}
                />
              </div>
            )}
          </div>

          <Link
            to="/dsa/my-problems"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-200 text-sm font-semibold cursor-pointer min-h-11"
          >
            <FolderCode className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span>My Problems</span>
          </Link>

          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-200 text-sm font-semibold cursor-pointer min-h-11"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span>Student Dashboard</span>
          </Link>

          {onNavigateToSubmit && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToSubmit();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 cursor-pointer min-h-11"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>New Problem</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
