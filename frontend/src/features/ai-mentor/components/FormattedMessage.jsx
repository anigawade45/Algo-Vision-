import React from 'react';

/**
 * Custom Markdown and Code Snippet renderer for AI Mentor messages.
 * Formats code blocks ```lang ... ```, inline code `code`, bold text, lists, and headers cleanly.
 */
export default function FormattedMessage({ text }) {
  if (!text) return null;

  // Split content by fenced code blocks ``` ... ```
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || 'code', content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return (
    <div className="space-y-3 leading-relaxed text-xs sm:text-sm">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className="my-2 rounded-xl bg-[#070a12] border border-slate-800 overflow-hidden font-mono text-xs">
              <div className="bg-[#0f172a] px-3 py-1.5 border-b border-slate-800 text-slate-400 font-bold text-[10px] flex items-center justify-between">
                <span>{part.language.toUpperCase()}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(part.content)}
                  className="hover:text-cyan-400 cursor-pointer transition-colors"
                >
                  Copy Code
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-cyan-300">
                <code>{part.content}</code>
              </pre>
            </div>
          );
        }

        // Process rich inline text formatting
        const lines = part.content.split('\n');
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              if (!line.trim()) return <div key={lineIdx} className="h-1" />;

              // Headers ### or ##
              if (line.startsWith('### ')) {
                return <h4 key={lineIdx} className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-2">{line.replace('### ', '')}</h4>;
              }
              if (line.startsWith('## ')) {
                return <h3 key={lineIdx} className="font-extrabold text-slate-900 dark:text-white text-base mt-2">{line.replace('## ', '')}</h3>;
              }

              // Bullet points - or *
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                const bulletText = line.trim().replace(/^[-*]\s+/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold text-xs mt-1">•</span>
                    <span className="flex-1">{formatInlineStyles(bulletText)}</span>
                  </div>
                );
              }

              // Numbered lists 1. 2.
              if (/^\d+\.\s/.test(line.trim())) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold text-xs mt-0.5">{line.trim().match(/^\d+\./)[0]}</span>
                    <span className="flex-1">{formatInlineStyles(line.trim().replace(/^\d+\.\s+/, ''))}</span>
                  </div>
                );
              }

              return <p key={lineIdx}>{formatInlineStyles(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

// Helper to handle **bold** and `inline code`
function formatInlineStyles(str) {
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((segment, idx) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{segment.slice(2, -2)}</strong>;
    }
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">{segment.slice(1, -1)}</code>;
    }
    return segment;
  });
}

