import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Code, RefreshCw } from 'lucide-react';

export default function CodeEditor({
  code = '',
  onChange = () => {},
  language = 'javascript',
  readOnly = false,
  onRun = () => {}
}) {
  const editorRef = useRef(null);

  // Map language identifiers for Monaco
  const getMonacoLang = (lang) => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      case 'javascript': default: return 'javascript';
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add keyboard shortcut Ctrl/Cmd + Enter to execute code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    // Configure editor settings
    editor.updateOptions({
      fontSize: 13,
      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      cursorBlinking: 'smooth',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true }
    });
  };

  return (
    <div className="w-full h-full min-h-[350px] flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      {/* Editor Title Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333] text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200 uppercase">{language}</span>
          <span className="text-[10px] text-slate-500">
            (Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl+Enter</kbd> to Run)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" title="Editor Ready" />
          <span className="text-[10px]">Monaco Engine</span>
        </div>
      </div>

      {/* Monaco Code Editor Instance */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language={getMonacoLang(language)}
          value={code}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 font-mono text-xs gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-500" /> Loading Code Editor Environment...
            </div>
          }
          options={{
            readOnly,
            fontSize: 13,
            tabSize: 2,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false }
          }}
        />
      </div>
    </div>
  );
}
