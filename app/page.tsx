"use client"

import { useState, useCallback, useEffect } from "react"
import { parse } from "@babel/parser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { cpp } from "@codemirror/lang-cpp"
import { EditorView, Decoration } from "@codemirror/view"
import { StateEffect, StateField } from "@codemirror/state"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Code, Play, RotateCcw, BookOpen } from "lucide-react"
import Link from "next/link"

type Language = "javascript" | "jsx" | "python" | "c"

const LANGUAGE_EXAMPLES = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result);`,
  jsx: `function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

const App = () => {
  return (
    <div className="container">
      <Welcome name="React" />
      <p>This is JSX code!</p>
    </div>
  );
};`,
  python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(f"Fibonacci result: {result}")`,
  c: `#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(10);
    printf("Fibonacci result: %d\\n", result);
    return 0;
}`,
}

interface ASTNode {
  type: string
  [key: string]: any
}

interface TreeNodeProps {
  node: ASTNode
  depth?: number
  isExpanded?: boolean
  onToggle?: () => void
  onNodeSelect?: (node: ASTNode) => void
}

const TreeNode = ({ node, depth = 0, isExpanded = false, onToggle, onNodeSelect }: TreeNodeProps) => {
  if (!node || typeof node.type !== 'string') {
    // If the node is not a valid AST node, render it as a string.
    return (
      <div className="py-1" style={{ marginLeft: `${depth * 12}px` }}>
        <span className="text-purple-600 font-sans text-sm bg-purple-50 px-2 py-1 rounded">
          {JSON.stringify(node)}
        </span>
      </div>
    );
  }

  const [expanded, setExpanded] = useState(isExpanded)

  const hasChildren =
    node &&
    typeof node === "object" &&
    Object.keys(node).some(
      (key) =>
        key !== "type" &&
        key !== "start" &&
        key !== "end" &&
        key !== "loc" &&
        (Array.isArray(node[key]) || (typeof node[key] === "object" && node[key] !== null)),
    )

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
    onToggle?.()
  }

  const handleSelect = () => {
    onNodeSelect?.(node)
  }

  const renderValue = (value: any, key: string) => {
    if (value === null || value === undefined) return null
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return (
        <div className="flex items-center gap-2 py-1">
          <span className="text-gray-500 text-xs font-medium min-w-[60px]">{key}:</span>
          <span className="text-blue-600 font-sans text-sm bg-blue-50 px-2 py-1 rounded">
            {JSON.stringify(value)}
          </span>
        </div>
      )
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? (
        <div className="ml-2">
          <div className="flex items-center gap-2 py-1">
            <span className="text-gray-500 text-xs font-medium min-w-[60px]">{key}:</span>
            <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded">
              [{value.length} items]
            </span>
          </div>
          {expanded && (
            <div className="ml-6 mt-2 space-y-1">
              {value.map((item, index) => (
                <TreeNode key={index} node={item} depth={depth + 1} onNodeSelect={onNodeSelect} />
              ))}
            </div>
          )}
        </div>
      ) : null
    }
    if (typeof value === "object" && value.type) {
      return (
        <div className="ml-2">
          <div className="flex items-center gap-2 py-1">
            <span className="text-gray-500 text-xs font-medium min-w-[60px]">{key}:</span>
          </div>
          <TreeNode node={value} depth={depth + 1} onNodeSelect={onNodeSelect} />
        </div>
      )
    }
    // Fallback for other object types that are not valid AST nodes
    if (typeof value === "object" && value !== null) {
      return (
        <div className="flex items-center gap-2 py-1">
          <span className="text-gray-500 text-xs font-medium min-w-[60px]">{key}:</span>
          <span className="text-purple-600 font-sans text-sm bg-purple-50 px-2 py-1 rounded">
            {JSON.stringify(value)}
          </span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="py-1" style={{ marginLeft: `${depth * 12}px` }}>
      <div
        onClick={handleSelect}
        className="flex items-center gap-3 group hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors cursor-pointer"
      >
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        <Badge variant="secondary" className="text-xs font-sans bg-indigo-100 text-indigo-700 border border-indigo-200">
          {node.type}
        </Badge>

        {node.name && (
          <span className="text-gray-800 font-sans text-sm font-medium">
            {node.name}
          </span>
        )}
        {node.value !== undefined && (
          <span className="text-green-600 font-sans text-sm bg-green-50 px-2 py-1 rounded">
            = {JSON.stringify(node.value)}
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-4 space-y-1">
          {Object.entries(node)
            .filter(([key]) => key !== "type" && key !== "start" && key !== "end" && key !== "loc")
            .map(([key, value]) => (
              <div key={key}>{renderValue(value, key)}</div>
            ))}
        </div>
      )}
    </div>
  )
}

const parsePythonAST = (code: string): ASTNode => {
  // Simple Python AST parser implementation
  const lines = code.split("\n").filter((line) => line.trim())
  const ast: ASTNode = {
    type: "Module",
    body: [],
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith("def ")) {
      // Function definition
      const match = line.match(/def\s+(\w+)\s*$$(.*?)$$:/)
      if (match) {
        const [, name, params] = match
        ast.body.push({
          type: "FunctionDef",
          name: { type: "Name", id: name },
          args: {
            type: "arguments",
            args: params
              .split(",")
              .map((p) => ({
                type: "arg",
                arg: p.trim(),
                annotation: null,
              }))
              .filter((arg) => arg.arg),
          },
          body: [{ type: "Pass" }],
          decorator_list: [],
          returns: null,
        })
      }
    } else if (line.startsWith("class ")) {
      // Class definition
      const match = line.match(/class\s+(\w+)(?:$$(.*?)$$)?:/)
      if (match) {
        const [, name, bases] = match
        ast.body.push({
          type: "ClassDef",
          name: name,
          bases: bases ? bases.split(",").map((b) => ({ type: "Name", id: b.trim() })) : [],
          keywords: [],
          body: [{ type: "Pass" }],
          decorator_list: [],
        })
      }
    } else if (line.includes("=") && !line.startsWith("if") && !line.startsWith("for")) {
      // Assignment
      const [left, right] = line.split("=", 2)
      ast.body.push({
        type: "Assign",
        targets: [{ type: "Name", id: left.trim() }],
        value: {
          type: "Constant",
          value: right.trim(),
          kind: null,
        },
      })
    } else if (line.startsWith("if ")) {
      // If statement
      const condition = line.replace("if ", "").replace(":", "").trim()
      ast.body.push({
        type: "If",
        test: {
          type: "Compare",
          left: { type: "Name", id: condition.split(" ")[0] },
          ops: [{ type: "Lt" }],
          comparators: [{ type: "Constant", value: "condition" }],
        },
        body: [{ type: "Pass" }],
        orelse: [],
      })
    } else if (line.startsWith("for ")) {
      // For loop
      const match = line.match(/for\s+(\w+)\s+in\s+(.*?):/)
      if (match) {
        const [, target, iter] = match
        ast.body.push({
          type: "For",
          target: { type: "Name", id: target },
          iter: { type: "Name", id: iter.trim() },
          body: [{ type: "Pass" }],
          orelse: [],
        })
      }
    } else if (line.startsWith("return ")) {
      // Return statement
      const value = line.replace("return ", "").trim()
      ast.body.push({
        type: "Return",
        value: {
          type: "Name",
          id: value,
        },
      })
    } else if (line.includes("(") && line.includes(")")) {
      // Function call
      const match = line.match(/(\w+)\s*$$(.*?)$$/)
      if (match) {
        const [, func, args] = match
        ast.body.push({
          type: "Expr",
          value: {
            type: "Call",
            func: { type: "Name", id: func },
            args: args
              .split(",")
              .map((arg) => ({
                type: "Name",
                id: arg.trim(),
              }))
              .filter((arg) => arg.id),
            keywords: [],
          },
        })
      }
    }
  }

  return ast
}

const highlightEffect = StateEffect.define<{ start: number; end: number } | null>()

const highlightField = StateField.define({
  create() {
    return Decoration.none
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(highlightEffect)) {
        if (e.value) {
          const { start, end } = e.value
          const highlightMark = Decoration.mark({ class: "cm-highlight" })
          return Decoration.set([highlightMark.range(start, end)])
        } else {
          return Decoration.none
        }
      }
    }
    return decorations
  },
  provide: (f) => EditorView.decorations.from(f),
})

const highlightTheme = EditorView.baseTheme({
  ".cm-highlight": { backgroundColor: "rgba(160, 120, 220, 0.3)" },
})

export default function ASTVisualizer() {
  const [language, setLanguage] = useState<Language>("jsx")
  const [code, setCode] = useState(LANGUAGE_EXAMPLES.jsx)
  const [ast, setAst] = useState<ASTNode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  const [view, setView] = useState<EditorView>()

  const handleNodeSelect = useCallback((node: ASTNode) => {
    if (node && typeof node.start === "number" && typeof node.end === "number") {
      setSelection({ start: node.start, end: node.end })
    }
  }, [])

  const onUpdate = useCallback((viewUpdate: any) => {
    setView(viewUpdate.view)
  }, [])

  useEffect(() => {
    if (view) {
      view.dispatch({
        effects: highlightEffect.of(selection),
      })
    }
  }, [selection, view])

  const parseCode = async () => {
    if (!code.trim()) {
      setError("Please enter some code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let parsed: any

      if (language === "javascript" || language === "jsx") {
        parsed = parse(code, {
          sourceType: "module",
          allowImportExportEverywhere: true,
          allowReturnOutsideFunction: true,
          plugins: [
            language === "jsx" ? "jsx" : null,
            "typescript",
            "decorators-legacy",
            "classProperties",
            "asyncGenerators",
            "functionBind",
            "exportDefaultFrom",
            "exportNamespaceFrom",
            "dynamicImport",
            "nullishCoalescingOperator",
            "optionalChaining",
          ].filter(Boolean),
        })
      } else if (language === "python") {
        parsed = parsePythonAST(code)
      } else if (language === "c") {
        setError("C AST parsing is not yet implemented. This would require a C parser.")
        return
      }

      setAst(parsed)
    } catch (err: any) {
      setError(`Parse Error: ${err.message}`)
      setAst(null)
    } finally {
      setIsLoading(false)
    }
  }

  const resetCode = () => {
    setCode(LANGUAGE_EXAMPLES[language])
    setAst(null)
    setError(null)
    setSelection(null)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setCode(LANGUAGE_EXAMPLES[newLanguage])
    setAst(null)
    setError(null)
    setSelection(null)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-purple-600" size={32} />
            <h1 className="text-3xl font-bold">Multi-Language AST Visualizer</h1>
          </div>
          <p className="text-gray-600">
            Explore computer science concepts through interactive visualizations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Code Input Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {(["javascript", "jsx", "python", "c"] as Language[]).map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        variant={language === lang ? "default" : "outline"}
                        size="sm"
                        className={language === lang ? "bg-purple-600 hover:bg-purple-700" : "bg-transparent"}
                      >
                        {lang.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={parseCode}
                    disabled={isLoading}
                    size="sm"
                    className="flex items-center gap-2 ml-4"
                  >
                    <Play size={16} />
                    {isLoading ? "Parsing..." : "Parse"}
                  </Button>
                  <Button
                    onClick={resetCode}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <CodeMirror
                value={code}
                height="400px"
                extensions={[
                  language === "javascript" || language === "jsx"
                    ? javascript({ jsx: true })
                    : language === "python"
                    ? python()
                    : language === "c"
                    ? cpp()
                    : javascript({ jsx: true }),
                  highlightField,
                  highlightTheme,
                ]}
                onChange={(value) => setCode(value)}
                onUpdate={onUpdate}
                className="h-[400px] font-sans text-sm resize-none bg-white text-gray-900 border border-gray-300 rounded-md"
              />
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
              )}
            </CardContent>
          </Card>

          {/* AST Visualization Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Abstract Syntax Tree</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-[400px] overflow-auto bg-gray-50 rounded-lg p-4">
                {ast ? (
                  <div className="font-sans text-sm">
                    <TreeNode node={ast} isExpanded={true} onNodeSelect={handleNodeSelect} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Code size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-gray-600">Parse your {language.toUpperCase()} code to see the AST structure</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Explanation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How AST Visualization Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step-by-step process */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-3">
                    <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                    <h4 className="font-semibold text-blue-800">Write Code</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Enter your code in the left panel. Choose from JavaScript, JSX, Python, or C.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-3">
                    <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                    <h4 className="font-semibold text-green-800">Parse Code</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click "Parse" to convert your code into an Abstract Syntax Tree (AST).
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-3">
                    <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                    <h4 className="font-semibold text-purple-800">Explore Tree</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Navigate the tree structure to understand how your code is organized.
                  </p>
                </div>
              </div>

              {/* Detailed explanation */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Understanding the AST Structure</h4>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">What is an AST?</h5>
                    <p className="text-gray-600 mb-3">
                      An Abstract Syntax Tree (AST) is a tree representation of your code's structure. Instead of seeing code as text, 
                      the AST shows the logical relationships between different parts of your code.
                    </p>
                    <h5 className="font-medium text-gray-800 mb-2">Why is it useful?</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Understand code structure at a glance</li>
                      <li>• Debug complex syntax issues</li>
                      <li>• Learn how compilers interpret code</li>
                      <li>• Analyze code patterns and complexity</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">How to read the tree:</h5>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">FunctionDef</span>
                        <span className="text-sm">→ Function definitions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">Variable</span>
                        <span className="text-sm">→ Variable declarations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">Call</span>
                        <span className="text-sm">→ Function calls</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">If</span>
                        <span className="text-sm">→ Conditional statements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Interactive tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">💡 Interactive Tips</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Navigation:</h5>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Click <span className="font-mono">▶</span> to expand/collapse nodes</li>
                      <li>• Hover over nodes to highlight them</li>
                      <li>• Scroll to explore large trees</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Understanding:</h5>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Each node represents a code construct</li>
                      <li>• Child nodes show details and properties</li>
                      <li>• Colors indicate different data types</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About CS Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What is an AST?</h4>
                <p>
                  An Abstract Syntax Tree (AST) is a tree representation of the syntactic structure of source code. Each
                  node represents a construct occurring in the programming language.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Supported Languages</h4>
                <ul className="space-y-1">
                  <li>
                    • <strong>JavaScript:</strong> Full ES6+ syntax support
                  </li>
                  <li>
                    • <strong>JSX:</strong> React components and JSX elements
                  </li>
                  <li>
                    • <strong>Python:</strong> Basic syntax parsing (functions, classes, assignments)
                  </li>
                  <li>
                    • <strong>C:</strong> Coming soon - parser integration needed
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
