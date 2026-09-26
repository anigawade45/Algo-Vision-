import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';

/**
 * EXECUTION CONTROLS
 * Provides step-by-step controls (Prev, Next, Reset, Play/Pause) with keyboard navigation and Fullscreen mode.
 */
export function ExecutionControls({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onReset,
  sectionNo = '03',
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play interval timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      if (currentStep >= totalSteps - 1) {
        setIsPlaying(false);
      } else {
        timer = setInterval(() => {
          onNext();
        }, 1200);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentStep, totalSteps, onNext]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid firing shortcuts when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentStep < totalSteps - 1) onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStep > 0) onPrev();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsPlaying(false);
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, onNext, onPrev, onReset]);

  const togglePlay = () => {
    if (currentStep >= totalSteps - 1) {
      onReset();
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <section aria-labelledby="execution-controls-heading" className="font-sans">
      {/* Screen Reader Live Region for Step Progress */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Execution step {currentStep + 1} of {totalSteps}
      </div>

      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#070A13] border border-slate-800 text-white font-sans space-y-2 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Step Counter Badge */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-400 uppercase tracking-[0.08em]">
            <span>{sectionNo}</span>
            <span className="text-slate-500">•</span>
            <span>EXECUTION STEP CONTROLS</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300 font-extrabold text-xs">
              Step {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                onPrev();
              }}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Previous execution step"
              title="Shortcut: Left Arrow"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span className="font-bold">Prev</span>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className={`px-3.5 py-1.5 rounded-xl text-white font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
              aria-label={isPlaying ? 'Pause execution' : 'Play execution'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                onNext();
              }}
              disabled={currentStep === totalSteps - 1}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold transition-all duration-150 cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Next execution step"
              title="Shortcut: Right Arrow"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                onReset();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Reset to Step 1 (Shortcut: R)"
              aria-label="Reset execution"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Full Screen Toggle Button */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border border-slate-700/80 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ml-1"
                title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen Execution Mode'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Full Screen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1.5">
          <span>Keyboard: ← Prev | Next → | R Reset</span>
          <span>{isPlaying ? 'Auto-stepping...' : 'Manual Control Active'}</span>
        </div>
      </div>
    </section>
  );
}

export default ExecutionControls;
