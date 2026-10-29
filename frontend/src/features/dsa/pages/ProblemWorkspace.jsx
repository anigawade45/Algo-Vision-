import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  Target,
  Sparkles,
  Grid,
  Workflow,
  FileCode2,
  Code2,
  PlayCircle,
  Eye,
  Gauge,
  CheckCircle2,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  Check,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { DsaNavbar } from '../components/home/DsaNavbar';
import { ProblemStage } from '../components/problem/ProblemStage';
import { UnderstandingStage } from '../components/understanding/UnderstandingStage';
import { AnalogyStage } from '../components/analogy';
import { PatternStage } from '../components/pattern';
import { AlgorithmStage } from '../components/algorithm';
import { PseudocodeStage } from '../components/pseudocode';
import { CodeStage } from '../components/code';
import { DryRunStage } from '../components/dryrun';
import { VisualizationStage } from '../components/visualization';
import { PracticeStage } from '../components/practice';
import { ComplexityStage } from '../components/complexity';
import { getProblems, getProblemById, getProblemWorkspace, createProblemWorkspace, updateProblemWorkspace } from '@/api/dsa.api';

import { MOCK_PROBLEMS, getProblemById as getMockProblemById } from '../data/mockProblems';

const WORKSPACE_STAGES = [
  { id: 'problem', stepNo: '01', name: 'Your Problem', icon: Target, isBuilt: true },
  { id: 'understand', stepNo: '02', name: 'Understand', icon: Brain, isBuilt: true },
  { id: 'analogy', stepNo: '03', name: 'Analogy', icon: Sparkles, isBuilt: true },
  { id: 'pattern', stepNo: '04', name: 'Pattern', icon: Grid, isBuilt: true },
  { id: 'algorithm', stepNo: '05', name: 'Algorithm', icon: Workflow, isBuilt: true },
  { id: 'pseudocode', stepNo: '06', name: 'Pseudocode', icon: FileCode2, isBuilt: true },
  { id: 'code', stepNo: '07', name: 'Code', icon: Code2, isBuilt: true },
  { id: 'dryrun', stepNo: '08', name: 'Dry Run', icon: PlayCircle, isBuilt: true },
  { id: 'visualize', stepNo: '09', name: 'Visualize', icon: Eye, isBuilt: true },
  { id: 'complexity', stepNo: '10', name: 'Complexity', icon: Gauge, isBuilt: true },
  { id: 'practice', stepNo: '11', name: 'Practice', icon: CheckCircle2, isBuilt: true },
];

const STAGE_ID_MAP = {
  1: 'problem',
  2: 'understand',
  3: 'analogy',
  4: 'pattern',
  5: 'algorithm',
  6: 'pseudocode',
  7: 'code',
  8: 'dryrun',
  9: 'visualize',
  10: 'complexity',
  11: 'practice',
};

const STAGE_NUM_MAP = {
  problem: 1,
  understand: 2,
  analogy: 3,
  pattern: 4,
  algorithm: 5,
  pseudocode: 6,
  code: 7,
  dryrun: 8,
  visualize: 9,
  complexity: 10,
  practice: 11,
};

export default function ProblemWorkspace({
  theme,
  toggleTheme,
  problemData,
  onNavigateToHome,
  onNavigateToSubmit,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stageQuery = searchParams.get('stage');

  // By default, opening any problem lands on Stage 01: 'problem' ("Your Problem").
  // If a valid stage is explicitly requested via URL query param (?stage=...), respect it.
  const getInitialStage = () => {
    if (stageQuery && WORKSPACE_STAGES.some((s) => s.id === stageQuery)) {
      return stageQuery;
    }
    return 'problem';
  };

  const [currentStageId, setCurrentStageId] = useState(getInitialStage);
  const [completedStages, setCompletedStages] = useState({});
  const [activeProblem, setActiveProblem] = useState(problemData || null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState(null);
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [dbProblems, setDbProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(id || 'two-sum');
  const [selectedApproachId, setSelectedApproachId] = useState(null);
  const [selectedApproachName, setSelectedApproachName] = useState(null);

  const targetProblemId = id || selectedProblemId || 'two-sum';

  const handleApproachSelect = (approachId, approachName) => {
    setSelectedApproachId(approachId);
    if (approachName) setSelectedApproachName(approachName);
  };

  // Reset selected approach and ensure Stage 01 ("Your Problem") is active when problem changes
  useEffect(() => {
    setSelectedApproachId(null);
    setSelectedApproachName(null);
    setCurrentStageId(getInitialStage());
  }, [targetProblemId, stageQuery]);

  const loadBackendProblems = async () => {
    try {
      const res = await getProblems();
      if (res?.success && Array.isArray(res?.data?.problems) && res.data.problems.length > 0) {
        setDbProblems(res.data.problems);
      }
    } catch (err) {
      console.log('Using local fallback problems:', err.message);
    }
  };

  useEffect(() => {
    loadBackendProblems();
  }, []);

  // Keep selectedProblemId synced when URL param id changes
  useEffect(() => {
    if (id) {
      setSelectedProblemId(id);
    }
  }, [id]);

  // Load Real Problem & Workspace State from Backend
  const initializeWorkspaceFlow = useCallback(async (isMountedRef = { current: true }) => {
    setIsLoadingProblem(true);
    setProblemError(null);
    setActiveProblem(null);

    // 1. Fetch Real Problem Data
    try {
      const pRes = await getProblemById(targetProblemId);
      if (!isMountedRef.current) return;
      if (pRes?.success && pRes?.data?.problem) {
        setActiveProblem(pRes.data.problem);
        setProblemError(null);
      } else {
        setActiveProblem(null);
        setProblemError(pRes?.message || 'Problem specification not found.');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.log('Failed loading problem from backend:', err.message);
      setActiveProblem(null);
      setProblemError(err.message || 'Failed loading problem from backend.');
    } finally {
      if (isMountedRef.current) {
        setIsLoadingProblem(false);
      }
    }

    // 2. Fetch Workspace State
    try {
      let wsRes = await getProblemWorkspace(targetProblemId);
      if (!isMountedRef.current) return;
      let ws = wsRes?.data?.workspace;

      // Initialize workspace if null
      if (!ws) {
        const createWsRes = await createProblemWorkspace(targetProblemId);
        if (!isMountedRef.current) return;
        ws = createWsRes?.data?.workspace;
      }

      if (ws && isMountedRef.current) {
        // Preserve completed stages so progress checkmarks are visible in the sidebar
        if (Array.isArray(ws.completedStages)) {
          const compObj = {};
          const sorted = [...new Set(ws.completedStages.map(Number))]
            .filter((n) => Number.isInteger(n) && n >= 1 && n <= 11)
            .sort((a, b) => a - b);
          let expected = 1;
          for (const stNum of sorted) {
            if (stNum === expected) {
  
  
              const stId = STAGE_ID_MAP[stNum];
              if (stId) compObj[stId] = true;
              expected++;
            } else if (stNum > expected) {
              break;
            }
          }




          setCompletedStages(compObj);
        }
      }
    } catch (wsErr) {
      if (isMountedRef.current) {
        console.log('Workspace state persistence note:', wsErr.message);
      }
    }
  }, [targetProblemId]);

  useEffect(() => {
    const isMountedRef = { current: true };
    initializeWorkspaceFlow(isMountedRef);

    return () => {
      isMountedRef.current = false;
    };
  }, [targetProblemId, initializeWorkspaceFlow]);

  // Helper to persist workspace state to backend
  const persistWorkspaceState = async (nextStageId, updatedCompletedMap) => {
    try {
      const stageNum = STAGE_NUM_MAP[nextStageId] || 1;
      const compArr = Object.keys(updatedCompletedMap)
        .map((stId) => STAGE_NUM_MAP[stId])
        .filter(Boolean);

      await updateProblemWorkspace(targetProblemId, {
        currentStage: stageNum,
        completedStages: compArr,
      });
    } catch (err) {
      console.log('Workspace state update failed:', err.message);
    }
  };
  const handleProblemChange = (newId) => {
    setActiveProblem(null);
    setSelectedProblemId(newId);
    setCurrentStageId('problem');
    if (id) {
      navigate(`/dsa/workspace/${newId}`);
    }
  };

  // Handle ESC key to close problem spec modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSpecDrawer) {
        setShowSpecDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSpecDrawer]);

  const problem = activeProblem || (problemData && problemData.title ? problemData : (targetProblemId === 'two-sum' ? getMockProblemById('two-sum') : null));

  const problemOptions = dbProblems.length > 0
    ? dbProblems.map((p) => ({
        id: p.slug || p.problemId || p._id,
        title: p.title,
      }))
    : MOCK_PROBLEMS;

  const activeStage = WORKSPACE_STAGES.find((s) => s.id === currentStageId) || WORKSPACE_STAGES[0];
  const activeStageIdx = WORKSPACE_STAGES.findIndex((s) => s.id === currentStageId);
  // Strict Sequential Progression:
  // Determine highest unlocked stage index based on contiguous completed stages starting from Stage 01.
  let maxUnlockedIndex = 0;
  while (
    maxUnlockedIndex < WORKSPACE_STAGES.length - 1 &&
    completedStages[WORKSPACE_STAGES[maxUnlockedIndex].id]
  ) {
    maxUnlockedIndex++;
  }

  const isStageUnlocked = (stageIdx) => stageIdx <= maxUnlockedIndex;
  // A stage only renders a green checkmark if all preceding stages are complete AND it is marked complete
  const isStageCompleted = (stageId, stageIdx) => stageIdx < maxUnlockedIndex && Boolean(completedStages[stageId]);
  const consecutiveCompletedCount = WORKSPACE_STAGES.filter((st, idx) => isStageCompleted(st.id, idx)).length;
  const isCurrentStageCompleted = currentStageId === 'problem' || Boolean(completedStages[currentStageId]);
  const isNextDisabled = activeStageIdx === WORKSPACE_STAGES.length - 1 || !isCurrentStageCompleted;

  // Active stage safety check: If user's selected stage is currently locked, redirect to highest unlocked stage
  useEffect(() => {
    if (activeStageIdx > maxUnlockedIndex) {
      const fallbackStage = WORKSPACE_STAGES[maxUnlockedIndex] || WORKSPACE_STAGES[0];
      setCurrentStageId(fallbackStage.id);
    }
  }, [maxUnlockedIndex, activeStageIdx]);

  const handleStageSelect = (stageId) => {
    const targetIdx = WORKSPACE_STAGES.findIndex((s) => s.id === stageId);
    if (targetIdx === -1 || !isStageUnlocked(targetIdx)) {
      return;
    }
    setCurrentStageId(stageId);
    persistWorkspaceState(stageId, completedStages);
  };

  const handleStageComplete = useCallback((stageId) => {
    setCompletedStages((prev) => {
      if (prev[stageId]) return prev;
      const updated = { ...prev, [stageId]: true };
      persistWorkspaceState(currentStageId, updated);
      return updated;
    });
  }, [currentStageId]);

  const handleNextStage = () => {
    if (activeStageIdx < WORKSPACE_STAGES.length - 1) {
      let updatedCompleted = completedStages;
      if (currentStageId === 'problem' && !completedStages['problem']) {
        updatedCompleted = { ...completedStages, problem: true };
        setCompletedStages(updatedCompleted);
      } else if (!completedStages[currentStageId]) {
        return;
      }
      const nextStageId = WORKSPACE_STAGES[activeStageIdx + 1].id;


      setCurrentStageId(nextStageId);
      persistWorkspaceState(nextStageId, updatedCompleted);
    }
  };

  const handlePrevStage = () => {
    if (activeStageIdx > 0) {
      const prevStageId = WORKSPACE_STAGES[activeStageIdx - 1].id;
      setCurrentStageId(prevStageId);
      persistWorkspaceState(prevStageId, completedStages);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white flex flex-col">

      {/* Top Shell Navbar */}
      <DsaNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigateToLanding={onNavigateToHome}
        onNavigateToHome={onNavigateToHome}
        onNavigateToSubmit={onNavigateToSubmit}
      />

      {/* Main Workspace with Attached Collapsible Sticky Sidebar */}
      <div className="flex flex-1 min-h-[calc(100vh-64px)] relative">

        {/* ================================================= */}
        {/* DOCKED STICKY LEFT SIDEBAR (DESKTOP / TABLET md+) */}
        {/* ================================================= */}
        <aside
          aria-label="Workspace Sidebar Navigation"
          className={`hidden md:flex sticky top-[64px] h-[calc(100vh-64px)] shrink-0 bg-white dark:bg-[#0B101D] border-r border-slate-200 dark:border-[#1E2638] transition-all duration-300 ease-in-out flex-col z-20 overflow-hidden ${isSidebarExpanded ? 'w-72' : 'w-16'
            }`}
        >
          {/* Sidebar Top Controls / Header */}
          <div className="p-3 border-b border-slate-100 dark:border-[#162032] flex items-center justify-between gap-2">
            {isSidebarExpanded ? (
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={onNavigateToHome}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
                  title="Back to DSA Home"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>DSA Home</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowSpecDrawer(true)}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono font-bold cursor-pointer border border-blue-200 dark:border-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    title="View Problem Spec"
                  >
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSidebarExpanded(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161F33] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    title="Collapse Sidebar"
                    aria-label="Collapse Sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full py-1">
                <button
                  type="button"
                  onClick={() => setIsSidebarExpanded(true)}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono cursor-pointer border border-blue-200 dark:border-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  title="Expand Sidebar"
                  aria-label="Expand Sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Active Problem Summary Card & Selector inside Sidebar */}
          {isSidebarExpanded && (
            <div className="p-4 border-b border-slate-100 dark:border-[#162032] space-y-3">
              <div className="space-y-1">
                <label
                  htmlFor="desktop-problem-selector"
                  className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
                >
                  ACTIVE PROBLEM
                </label>
                <select
                  id="desktop-problem-selector"
                  aria-label="Select DSA Problem"
                  value={targetProblemId}
                  onChange={(e) => handleProblemChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold rounded-xl px-2.5 py-2 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                >
                  {problemOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Progress</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{consecutiveCompletedCount} / 11</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${(consecutiveCompletedCount / 11) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 11 Pipeline Stage Items */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
            {isSidebarExpanded && (
              <div className="px-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                PIPELINE STAGES
              </div>
            )}

            <nav className="space-y-1" aria-label="DSA Pipeline Stages">
              {WORKSPACE_STAGES.map((st, idx) => {
                const isUnlocked = isStageUnlocked(idx);
                const isLocked = !isUnlocked;
                const isSelected = st.id === currentStageId;
                const isCompleted = isStageCompleted(st.id, idx);
                const IconComp = st.icon;

                return (
                  <button
                    key={st.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() => handleStageSelect(st.id)}
                    title={
                      isLocked
                        ? `Stage ${st.stepNo} (${st.name}) is locked. Complete Stage ${WORKSPACE_STAGES[idx - 1]?.stepNo} (${WORKSPACE_STAGES[idx - 1]?.name}) first.`
                        : st.name
                    }
                    aria-current={isSelected ? 'step' : undefined}
                    aria-disabled={isLocked}
                    className={`w-full text-xs font-mono transition-all flex items-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isSidebarExpanded
                        ? 'p-2.5 rounded-xl justify-between'
                        : 'p-2.5 rounded-xl justify-center'
                    } ${
                      isLocked
                        ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-400 dark:text-slate-600 border-transparent hover:bg-transparent'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs cursor-pointer'
                        : isCompleted
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100/50 cursor-pointer'
                        : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-[#161F33] cursor-pointer'
                    }`}
                  >
                    {isSidebarExpanded ? (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-400'}`}>
                            {st.stepNo}
                          </span>
                          <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-400'}`} aria-hidden="true" />
                          <span className="truncate">{st.name}</span>
                        </div>

                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
                        ) : isCompleted && !isSelected ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                        ) : null}

                        {!st.isBuilt && !isSelected && !isLocked && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-400 font-mono">
                            Soon
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-400'}`} aria-hidden="true" />
                        {isLocked ? (
                          <Lock className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600 absolute -bottom-1 -right-1" aria-hidden="true" />
                        ) : isCompleted && !isSelected ? (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Toggle (when collapsed) */}
          {!isSidebarExpanded && (
            <div className="p-2 border-t border-slate-100 dark:border-[#162032] flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSpecDrawer(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-[#161F33] cursor-pointer"
                title="Problem Spec"
                aria-label="Problem Spec"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onNavigateToHome}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-[#161F33] cursor-pointer"
                title="Back to DSA Home"
                aria-label="Back to DSA Home"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </aside>

        {/* ================================================= */}
        {/* MAIN STAGE WORKSPACE CANVAS                       */}
        {/* ================================================= */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto">

          {/* MOBILE PIPELINE STAGES STRIP (< md screens) */}
          <div className="block md:hidden p-3 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-[#162032] pb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>PIPELINE STAGES</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
                  {consecutiveCompletedCount} / 11
                </span>
              </div>

              <select
                id="mobile-problem-selector"
                aria-label="Select test problem"
                value={targetProblemId}
                onChange={(e) => handleProblemChange(e.target.value)}
                className="bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold rounded-lg px-2 py-1 text-slate-900 dark:text-white cursor-pointer max-w-40 truncate focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {problemOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Horizontal Scrollable Stages Bar */}
            <nav className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 touch-pan-x text-xs font-mono" aria-label="Mobile Pipeline Navigation">
              {WORKSPACE_STAGES.map((st, idx) => {
                const isUnlocked = isStageUnlocked(idx);
                const isLocked = !isUnlocked;
                const isSelected = st.id === currentStageId;
                const isCompleted = isStageCompleted(st.id, idx);
                const IconComp = st.icon;

                return (
                  <button
                    key={st.id}
                    id={`stage-nav-btn-${st.id}`}
                    type="button"
                    disabled={isLocked}
                    onClick={() => handleStageSelect(st.id)}
                    aria-current={isSelected ? 'step' : undefined}
                    aria-disabled={isLocked}
                    title={
                      isLocked
                        ? `Stage ${st.stepNo} (${st.name}) is locked. Complete Stage ${WORKSPACE_STAGES[idx - 1]?.stepNo} (${WORKSPACE_STAGES[idx - 1]?.name}) first.`
                        : st.name
                    }
                    className={`shrink-0 px-3 py-2 rounded-xl border flex items-center gap-2 transition-all min-h-[38px] ${
                      isLocked
                        ? 'opacity-40 cursor-not-allowed bg-transparent border-dashed border-slate-200 dark:border-slate-800 text-slate-400'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs cursor-pointer'
                        : isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 font-medium cursor-pointer'
                        : 'bg-slate-50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1E2638] font-medium cursor-pointer'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-400'}`}>
                      {st.stepNo}
                    </span>
                    <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-400'}`} aria-hidden="true" />
                    <span className="whitespace-nowrap">{st.name}</span>
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    ) : isCompleted && !isSelected ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Active Stage View */}
          <div className="min-h-[500px]" key={targetProblemId}>
            {currentStageId === 'problem' && (
              <ProblemStage
                problemData={problem}
                isLoading={isLoadingProblem}
                errorMessage={problemError}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
                onRetry={initializeWorkspaceFlow}
              />
            )}

            {currentStageId === 'understand' && (
              <UnderstandingStage
                problemData={problem}
                isCompleted={Boolean(completedStages['understand'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'analogy' && (
              <AnalogyStage
                problemData={problem}
                isCompleted={Boolean(completedStages['analogy'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'pattern' && (
              <PatternStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                isCompleted={Boolean(completedStages['pattern'])}
                onSelectApproach={handleApproachSelect}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'algorithm' && (
              <AlgorithmStage
                problem={problem}
                problemData={problem}
                selectedApproachId={selectedApproachId}
                isCompleted={Boolean(completedStages['algorithm'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'pseudocode' && (
              <PseudocodeStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                selectedApproachName={selectedApproachName}
                isCompleted={Boolean(completedStages['pseudocode'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'code' && (
              <CodeStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                selectedApproachName={selectedApproachName}
                isCompleted={Boolean(completedStages['code'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'dryrun' && (
              <DryRunStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                selectedApproachName={selectedApproachName}
                isCompleted={Boolean(completedStages['dryrun'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'visualize' && (
              <VisualizationStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                selectedApproachName={selectedApproachName}
                isCompleted={Boolean(completedStages['visualize'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onNavigateToStage={(stId) => handleStageSelect(stId)}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'complexity' && (
              <ComplexityStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                selectedApproachName={selectedApproachName}
                isCompleted={Boolean(completedStages['complexity'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {currentStageId === 'practice' && (
              <PracticeStage
                problem={problem}
                selectedApproachId={selectedApproachId}
                isCompleted={Boolean(completedStages['practice'])}
                onCompleteStage={handleStageComplete}
                onNextStage={handleNextStage}
                onOpenSpec={() => setShowSpecDrawer(true)}
              />
            )}

            {!activeStage.isBuilt && (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-4 max-w-2xl mx-auto my-8 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 animate-pulse" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    STAGE {activeStage.stepNo} / 11 · {activeStage.name.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Stage Coming Next
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Stage {activeStage.stepNo} ({activeStage.name}) is coming next as we build out the visual learning pipeline frame-by-frame. Stages 01 (Problem) and 02 (Understand) are fully active.
                  </p>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStageId('understand')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-colors cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Return to Stage 02: Understand →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Workspace Navigation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex items-center justify-between font-mono text-xs shadow-xs">
            <button
              type="button"
              onClick={handlePrevStage}
              disabled={activeStageIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#161F33] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2638] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Previous Stage</span>
            </button>

            <span className="hidden sm:inline-block text-slate-400">
              {activeStage.name} ({activeStage.stepNo} / 11)
            </span>

            <button
              type="button"
              onClick={handleNextStage}
              disabled={isNextDisabled}
              title={
                !isCurrentStageCompleted
                  ? `Complete Stage ${activeStage.stepNo} (${activeStage.name}) to unlock the next stage`
                  : activeStageIdx === WORKSPACE_STAGES.length - 1
                  ? 'You have reached the final stage'
                  : 'Advance to next stage'
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Next Stage</span>
              {!isCurrentStageCompleted ? (
                <Lock className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>

        </main>

      </div>

      {/* Accessible Problem Spec Modal */}
      {showSpecDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="spec-modal-title"
        >
          <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" aria-hidden="true" />
                <h3 id="spec-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Problem Specification: {problem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Close Problem Spec"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Statement:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-[#05070E] p-3.5 rounded-xl border border-slate-200/60 dark:border-[#162032]">
                  {problem.description}
                </p>
              </div>

              <div>
                <span className="font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Constraints:</span>
                <pre className="p-3 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200/60 dark:border-[#162032] font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {problem.constraints || 'None specified.'}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSpecDrawer(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
