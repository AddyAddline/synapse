'use client'

import { useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { OnMount } from '@monaco-editor/react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-950 text-gray-500 text-sm font-mono">
      Loading editor...
    </div>
  ),
})

interface CodeEditorProps {
  defaultValue?: string
  onChange?: (value: string) => void
  onRun?: () => void
  height?: string
  readOnly?: boolean
}

export function CodeEditor({
  defaultValue = '',
  onChange,
  onRun,
  height = '200px',
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor

      // Register MATLAB-like language
      monaco.languages.register({ id: 'matlab' })
      monaco.languages.setMonarchTokensProvider('matlab', {
        keywords: [
          'break', 'case', 'catch', 'continue', 'else', 'elseif', 'end',
          'for', 'function', 'global', 'if', 'otherwise', 'persistent',
          'return', 'switch', 'try', 'while', 'true', 'false',
        ],
        builtins: [
          'abs', 'acos', 'asin', 'atan', 'ceil', 'cos', 'disp', 'exp',
          'figure', 'floor', 'fprintf', 'imag', 'length', 'linspace',
          'load', 'log', 'log10', 'max', 'mean', 'median', 'min', 'mod',
          'norm', 'num2str', 'ones', 'plot', 'rand', 'randn', 'real',
          'reshape', 'round', 'save', 'sin', 'size', 'sort', 'sqrt',
          'std', 'subplot', 'sum', 'tan', 'title', 'xlabel', 'ylabel',
          'zeros', 'fft', 'ifft', 'filter', 'conv', 'whos', 'class',
        ],
        tokenizer: {
          root: [
            [/%.*$/, 'comment'],
            [/[a-zA-Z_]\w*/, {
              cases: {
                '@keywords': 'keyword',
                '@builtins': 'type.identifier',
                '@default': 'identifier',
              },
            }],
            [/'[^']*'/, 'string'],
            [/"[^"]*"/, 'string'],
            [/\d+(\.\d+)?([eE][+-]?\d+)?/, 'number'],
            [/[+\-*/^=<>~&|]/, 'operator'],
            [/[;,.]/, 'delimiter'],
            [/[[\](){}]/, '@brackets'],
          ],
        },
      })

      // Ctrl+Enter to run
      if (onRun) {
        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          () => onRun()
        )
      }
    },
    [onRun]
  )

  return (
    <div className="rounded-lg overflow-hidden border border-gray-800/60">
      <MonacoEditor
        height={height}
        language="matlab"
        theme="vs-dark"
        defaultValue={defaultValue}
        onChange={(val) => onChange?.(val || '')}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          tabSize: 4,
          wordWrap: 'on',
          readOnly,
          padding: { top: 12, bottom: 12 },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  )
}
