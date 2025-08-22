"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"

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

export const TreeNode = ({ node, depth = 0, isExpanded = false, onToggle, onNodeSelect }: TreeNodeProps) => {
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
