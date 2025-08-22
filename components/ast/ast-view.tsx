"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"
import { TreeNode } from "./tree-node"

interface ASTNode {
  type: string
  [key: string]: any
}

interface AstViewProps {
  ast: ASTNode | null
  language: string
  handleNodeSelect: (node: ASTNode) => void
}

export const AstView = ({ ast, language, handleNodeSelect }: AstViewProps) => {
  return (
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
  )
}
