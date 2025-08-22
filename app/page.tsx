"use client"

import { useState, useCallback, useEffect } from "react"
import { parse } from "@babel/parser"
import { EditorView, Decoration } from "@codemirror/view"
import { StateEffect, StateField } from "@codemirror/state"
import { Code } from "lucide-react"
import { About } from "@/components/ast/about"
import { AstView } from "@/components/ast/ast-view"
import { CodeEditor } from "@/components/ast/code-editor"
import { HowItWorks } from "@/components/ast/how-it-works"

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
      const match = line.match(/def\s+(\w+)\s*\((.*?)\):/)
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
      const match = line.match(/class\s+(\w+)(?:\((.*?)\))?:/)
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
      const match = line.match(/(\w+)\s*\((.*?)\)/)
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
          <CodeEditor
            language={language}
            code={code}
            isLoading={isLoading}
            error={error}
            highlightField={highlightField}
            highlightTheme={highlightTheme}
            handleLanguageChange={handleLanguageChange}
            parseCode={parseCode}
            resetCode={resetCode}
            setCode={setCode}
            onUpdate={onUpdate}
          />
          <AstView ast={ast} language={language} handleNodeSelect={handleNodeSelect} />
        </div>

        <HowItWorks />

        <About />
      </div>
    </div>
  )
}
