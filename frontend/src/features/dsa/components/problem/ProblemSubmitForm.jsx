import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  RotateCcw,
  FileText,
  Sliders,
  Lightbulb,
  Loader2,
  Plus,
  Trash2,
  Layers,
} from 'lucide-react';
import { createProblem } from '@/api/dsa.api';

const TWO_SUM_EXAMPLE = {
  title: 'Two Sum',
  description:
    'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',
  testCases: [
    { id: 1, input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { id: 2, input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
  ],
  constraints: '2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹',
  approach: '',
};

export default function ProblemSubmitForm({ onAnalyzeSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    constraints: '',
    approach: '',
  });

  // Support up to 8 Input and Output pairs
  const [testCases, setTestCases] = useState([
    { id: Date.now(), input: '', output: '' },
  ]);

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    constraints: false,
  });

  const [tcTouched, setTcTouched] = useState({});

  const [errors, setErrors] = useState({});
  const [tcErrors, setTcErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Validate individual base field
  const validateField = (name, value) => {
    let errorMsg = '';
    const trimmed = (value || '').trim();

    switch (name) {
      case 'title':
        if (!trimmed) errorMsg = 'Problem title is required.';
        break;
      case 'description':
        if (!trimmed) errorMsg = 'Problem description is required.';
        break;
      case 'constraints':
        if (!trimmed) errorMsg = 'Constraints are required.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  // Validate test cases
  const validateTestCases = (casesToValidate = testCases) => {
    const newTcErrors = {};
    casesToValidate.forEach((tc, index) => {
      const inputTrimmed = (tc.input || '').trim();
      const outputTrimmed = (tc.output || '').trim();

      const pairErrors = {};
      if (!inputTrimmed) {
        pairErrors.input = `Input ${index + 1} is required.`;
      }
      if (!outputTrimmed) {
        pairErrors.output = `Output ${index + 1} is required.`;
      }

      if (Object.keys(pairErrors).length > 0) {
        newTcErrors[tc.id] = pairErrors;
      }
    });

    setTcErrors(newTcErrors);
    return Object.keys(newTcErrors).length === 0;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    ['title', 'description', 'constraints'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    const isTcValid = validateTestCases();

    return Object.keys(newErrors).length === 0 && isTcValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce 2000 character limit on description
    if (name === 'description' && value.length > 2000) {
      return;
    }

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (apiError) setApiError(null);

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // Handle Test Case Field Changes
  const handleTestCaseChange = (id, field, value) => {
    setTestCases((prevCases) =>
      prevCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
    );

    if (apiError) setApiError(null);

    // Live validation if touched
    if (tcTouched[id]?.[field]) {
      setTcErrors((prev) => {
        const pair = prev[id] || {};
        const updatedPair = { ...pair };
        if (!value.trim()) {
          const index = testCases.findIndex((tc) => tc.id === id) + 1;
          updatedPair[field] = `${field === 'input' ? 'Input' : 'Output'} ${index} is required.`;
        } else {
          delete updatedPair[field];
        }

        if (Object.keys(updatedPair).length === 0) {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        }
        return { ...prev, [id]: updatedPair };
      });
    }
  };

  const handleTestCaseBlur = (id, field) => {
    setTcTouched((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: true },
    }));

    const tc = testCases.find((item) => item.id === id);
    if (tc) {
      const val = tc[field] || '';
      if (!val.trim()) {
        const index = testCases.findIndex((item) => item.id === id) + 1;
        setTcErrors((prev) => ({
          ...prev,
          [id]: {
            ...(prev[id] || {}),
            [field]: `${field === 'input' ? 'Input' : 'Output'} ${index} is required.`,
          },
        }));
      }
    }
  };

  // Add new Input & Output pair (max 8)
  const handleAddTestCase = () => {
    if (testCases.length >= 8) return;
    setTestCases((prev) => [...prev, { id: Date.now(), input: '', output: '' }]);
  };

  // Remove Input & Output pair
  const handleRemoveTestCase = (id) => {
    if (testCases.length <= 1) return;
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
    setTcErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleTryExample = () => {
    setFormData({
      title: TWO_SUM_EXAMPLE.title,
      description: TWO_SUM_EXAMPLE.description,
      constraints: TWO_SUM_EXAMPLE.constraints,
      approach: TWO_SUM_EXAMPLE.approach,
    });
    setTestCases(
      TWO_SUM_EXAMPLE.testCases.map((tc, i) => ({
        id: Date.now() + i,
        input: tc.input,
        output: tc.output,
      }))
    );
    setErrors({});
    setTcErrors({});
    setTouched({
      title: false,
      description: false,
      constraints: false,
    });
    setTcTouched({});
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      description: true,
      constraints: true,
    });

    // Mark all testcases touched
    const allTcTouched = {};
    testCases.forEach((tc) => {
      allTcTouched[tc.id] = { input: true, output: true };
    });
    setTcTouched(allTcTouched);

    const isValid = validateForm();
    if (!isValid) {
      const firstErrorField = document.querySelector('[data-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    // Form payload with testCases array and formatted single fields
    const submissionPayload = {
      title: formData.title,
      description: formData.description,
      constraints: formData.constraints,
      approach: formData.approach,
      testCases: testCases.map((tc, idx) => ({
        id: idx + 1,
        inputRaw: tc.input,
        outputRaw: tc.output,
        input: tc.input,
        output: tc.output,
      })),
    };

    try {
      const res = await createProblem(submissionPayload);
      setIsSubmitting(false);
      const createdProblem = res.data || res.problem || res;
      if (onAnalyzeSuccess) {
        onAnalyzeSuccess(createdProblem);
      }
    } catch (err) {
      console.error('Problem submission failed:', err);
      setIsSubmitting(false);
      setApiError(err.message || 'Failed to submit problem to backend. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 sm:p-10 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-36 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Page Header */}
        <div className="relative z-10 text-center mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DSA PROBLEM ANALYSIS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analyze a DSA Problem
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Enter the problem details and test cases (up to 8 pairs) for step-by-step breakdown.
          </p>
        </div>

        {/* Global Failure Banner */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{apiError}</p>
            </div>
          </motion.div>
        )}

        {/* Single-Column Form */}
        <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-8">
          
          {/* SECTION 1: Problem Details */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#182030] pb-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                1. Problem Details
              </h2>
            </div>

            {/* Field 1: Problem Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                Problem Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Two Sum"
                data-invalid={Boolean(errors.title && touched.title)}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#05070E] border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.title && touched.title
                    ? 'border-red-400 dark:border-red-600 focus:ring-red-500/30'
                    : 'border-slate-200 dark:border-[#1E2638] focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Give your problem a short, recognizable title.
                </p>
                {errors.title && touched.title && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Field 2: Problem Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {formData.description.length} / 2000
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Paste or write the complete problem statement here..."
                data-invalid={Boolean(errors.description && touched.description)}
                className={`w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#05070E] border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 resize-y min-h-[190px] whitespace-pre-wrap transition-all ${
                  errors.description && touched.description
                    ? 'border-red-400 dark:border-red-600 focus:ring-red-500/30'
                    : 'border-slate-200 dark:border-[#1E2638] focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Describe the complete problem clearly, including what needs to be solved.
                </p>
                {errors.description && touched.description && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Input & Output Test Case Pairs (Max 8) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#182030] pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  2. Input & Output Specification
                </h2>
              </div>
              <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {testCases.length} / 8 Pairs
              </span>
            </div>

            {/* Test Case Pairs List */}
            <div className="space-y-6">
              {testCases.map((tc, index) => {
                const pairErr = tcErrors[tc.id] || {};
                const pairTouched = tcTouched[tc.id] || {};

                return (
                  <motion.div
                    key={tc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] space-y-4 relative group"
                  >
                    {/* Pair Header & Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-mono font-bold">
                          {index + 1}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Test Case Pair #{index + 1}
                        </span>
                      </div>

                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(tc.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-2.5 py-1 rounded-lg transition-colors"
                          title={`Remove Pair ${index + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Input Field */}
                    <div className="space-y-1.5">
                      <label htmlFor={`input-${tc.id}`} className="block text-xs font-semibold text-slate-800 dark:text-slate-300">
                        Input #{index + 1} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`input-${tc.id}`}
                        rows={2}
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(tc.id, 'input', e.target.value)}
                        onBlur={() => handleTestCaseBlur(tc.id, 'input')}
                        placeholder={`Enter input format or sample input for Pair #${index + 1}...`}
                        data-invalid={Boolean(pairErr.input && pairTouched.input)}
                        className={`w-full p-3 rounded-xl bg-white dark:bg-[#0B101D] border text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 resize-y min-h-[75px] transition-all ${
                          pairErr.input && pairTouched.input
                            ? 'border-red-400 dark:border-red-600 focus:ring-red-500/30'
                            : 'border-slate-200 dark:border-[#1E2638] focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                      {pairErr.input && pairTouched.input && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{pairErr.input}</span>
                        </p>
                      )}
                    </div>

                    {/* Output Field */}
                    <div className="space-y-1.5">
                      <label htmlFor={`output-${tc.id}`} className="block text-xs font-semibold text-slate-800 dark:text-slate-300">
                        Output #{index + 1} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`output-${tc.id}`}
                        rows={2}
                        value={tc.output}
                        onChange={(e) => handleTestCaseChange(tc.id, 'output', e.target.value)}
                        onBlur={() => handleTestCaseBlur(tc.id, 'output')}
                        placeholder={`Enter expected output or output format for Pair #${index + 1}...`}
                        data-invalid={Boolean(pairErr.output && pairTouched.output)}
                        className={`w-full p-3 rounded-xl bg-white dark:bg-[#0B101D] border text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 resize-y min-h-[75px] transition-all ${
                          pairErr.output && pairTouched.output
                            ? 'border-red-400 dark:border-red-600 focus:ring-red-500/30'
                            : 'border-slate-200 dark:border-[#1E2638] focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                      {pairErr.output && pairTouched.output && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{pairErr.output}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Add Pair Button (Disabled at 8 Pairs) */}
            <div className="pt-1 flex items-center justify-between">
              {testCases.length < 8 ? (
                <button
                  type="button"
                  onClick={handleAddTestCase}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/30 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Input & Output Pair ({testCases.length}/8)</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-mono">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Maximum limit of 8 Input & Output pairs reached.</span>
                </div>
              )}
            </div>

            {/* Field 5: Constraints */}
            <div className="space-y-1.5 pt-3">
              <label htmlFor="constraints" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                Constraints <span className="text-red-500">*</span>
              </label>
              <textarea
                id="constraints"
                name="constraints"
                rows={4}
                value={formData.constraints}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={`e.g.\n2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹`}
                data-invalid={Boolean(errors.constraints && touched.constraints)}
                className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-[#05070E] border text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 resize-y min-h-[110px] whitespace-pre-wrap transition-all ${
                  errors.constraints && touched.constraints
                    ? 'border-red-400 dark:border-red-600 focus:ring-red-500/30'
                    : 'border-slate-200 dark:border-[#1E2638] focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add the limits and conditions that apply to the problem.
                </p>
                {errors.constraints && touched.constraints && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.constraints}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Optional Thinking */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#182030] pb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                3. Optional Thinking
              </h2>
            </div>

            {/* Field 6: Your Approach (OPTIONAL) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="approach" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Your Approach <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </label>
              </div>
              <textarea
                id="approach"
                name="approach"
                rows={4}
                value={formData.approach}
                onChange={handleChange}
                placeholder="Have an idea? Describe your approach here. It's okay if you're not sure."
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y min-h-[110px] whitespace-pre-wrap transition-all"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share your initial thinking. AlgoVision can analyze and improve it later.
              </p>
            </div>
          </div>

          {/* SECTION 4: Actions Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#182030] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            {/* Try Example Action */}
            <button
              type="button"
              onClick={handleTryExample}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 hover:bg-slate-100 dark:bg-[#070A12] dark:hover:bg-[#111827] text-slate-700 dark:text-slate-300 text-xs font-mono font-medium transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
              <span>Try Example Problem</span>
            </button>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Problem...</span>
                </>
              ) : (
                <>
                  <span>Analyze Problem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
