"use client"

import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { cpp } from "@codemirror/lang-cpp"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, RotateCcw } from "lucide-react"

type Language = "javascript" | "jsx" | "python" | "c"

interface CodeEditorProps {
  language: Language
  code: string
  isLoading: boolean
  error: string | null
  highlightField: any
  highlightTheme: any
  handleLanguageChange: (lang: Language) => void
  parseCode: () => void
  resetCode: () => void
  setCode: (code: string) => void
  onUpdate: (viewUpdate: any) => void
}

export const CodeEditor = ({
  language,
  code,
  isLoading,
  error,
  highlightField,
  highlightTheme,
  handleLanguageChange,
  parseCode,
  resetCode,
  setCode,
  onUpdate,
}: CodeEditorProps) => {
  return (
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
  )
}
