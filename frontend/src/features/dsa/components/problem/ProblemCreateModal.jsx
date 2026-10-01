import React, { useState } from 'react';
import { createProblem } from '@/api/dsa.api';
import {
  X,
  Plus,
  Loader2,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export function ProblemCreateModal({ isOpen, onClose, onProblemCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Array');
  const [difficulty, setDifficulty] = useState('Easy');
  const [objective, setObjective] = useState('');
  const [description, setDescription] = useState('');
  const [constraintsText, setConstraintsText] = useState('');
  const [inputLabel, setInputLabel] = useState('INPUT DATA');
  const [inputValue, setInputValue] = useState('[2, 7, 11, 15]');
  const [outputLabel, setOutputLabel] = useState('REQUIRED OUTPUT');
  const [outputDescription, setOutputDescription] = useState('Indices of target sum pair');
  const [testCaseInput, setTestCaseInput] = useState('nums = [2, 7, 11, 15], target = 9');
  const [testCaseOutput, setTestCaseOutput] = useState('[0, 1]');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!title.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Title and Description are required' });
      return;
    }

    const constraints = constraintsText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const problemData = {
      title: title.trim(),
      category: category.trim(),
      difficulty,
      objective: objective.trim() || title.trim(),
      description: description.trim(),
      constraints: constraints.length > 0 ? constraints : ['Standard DSA constraints apply'],
      inputData: {
        type: 'custom',
        label: inputLabel.trim() || 'INPUT DATA',
        value: inputValue.trim(),
      },
      outputData: {
        type: 'custom',
        label: outputLabel.trim() || 'REQUIRED OUTPUT',
        description: outputDescription.trim(),
      },
      testCases: [
        {
          id: 1,
          inputRaw: testCaseInput.trim(),
          outputRaw: testCaseOutput.trim(),
          reasoning: ['Standard execution test case'],
        },
      ],
      tags: [category.trim()],
    };

    try {
      setLoading(true);
      const res = await createProblem(problemData);
      if (res?.success && res?.data?.problem) {
        setMessage({ type: 'success', text: 'Problem uploaded successfully!' });
        setTimeout(() => {
          if (onProblemCreated) onProblemCreated(res.data.problem);
          onClose();
        }, 1200);
      } else {
        setMessage({ type: 'error', text: res?.message || 'Failed to upload problem' });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error creating problem';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#080B14]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload New DSA Problem</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add a problem specification to the database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="create-problem-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {message.text && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Row 1: Title & Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Two Sum"
                className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Array, String, Tree..."
                className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full h-9 px-2 rounded-lg bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Objective Summary</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Short 1-line objective"
              className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Problem Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Detailed description of the problem statement..."
              className="w-full p-3 rounded-lg bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Constraints */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Constraints (1 per line)</label>
            <textarea
              rows={2}
              value={constraintsText}
              onChange={(e) => setConstraintsText(e.target.value)}
              placeholder="2 <= nums.length <= 10^4&#10;-10^9 <= target <= 10^9"
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Sample Test Case */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-400">Sample Test Case #1</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10.5px] text-slate-500">Sample Input</label>
                <input
                  type="text"
                  value={testCaseInput}
                  onChange={(e) => setTestCaseInput(e.target.value)}
                  placeholder="nums = [2, 7, 11, 15], target = 9"
                  className="w-full h-8 px-2.5 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10.5px] text-slate-500">Sample Output</label>
                <input
                  type="text"
                  value={testCaseOutput}
                  onChange={(e) => setTestCaseOutput(e.target.value)}
                  placeholder="[0, 1]"
                  className="w-full h-8 px-2.5 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-[#080B14]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-problem-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Upload Problem</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
