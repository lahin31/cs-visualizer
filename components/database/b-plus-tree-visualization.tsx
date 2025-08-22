"use client"

import { useState } from "react"

export const BPlusTreeVisualization = ({
  isSearch,
  isInsertionAnimation,
  insertionStep,
  insertionValue,
}: {
  isSearch?: boolean
  isInsertionAnimation?: boolean
  insertionStep?: number
  insertionValue?: number
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [searchPath, setSearchPath] = useState<string[]>([])
  const [range, setRange] = useState<[number, number] | null>([30, 80])

  const getInitialLeafNodes = () => [
    [[10, 20], [30, 40], [45, 48]],
    [[55, 60], [70, 80], [90, 95]],
    [[110, 120], [130, 140], [160, 170]],
  ]

  let leafNodesData = getInitialLeafNodes()
  let rootKeys = [50, 100]
  let middleKeys = [[25, 35], [75, 85], [125, 150]]
  let highlightPath: string[] = []

  if (isInsertionAnimation && insertionValue) {
    switch (insertionStep) {
      case 1: // Find Leaf Node
        highlightPath = ["root", "middle", "leaf-1-0"]
        break
      case 2: // Insert Key (Overflow)
        highlightPath = ["root", "middle", "leaf-1-0"]
        leafNodesData[1][0] = [55, 60, insertionValue]
        break
      case 3: // Split Node
        highlightPath = ["root", "middle", "leaf-1-0", "leaf-1-1"]
        leafNodesData[1][0] = [55]
        leafNodesData[1].splice(1, 0, [60, insertionValue])
        break
      case 4: // Promote Key
        highlightPath = ["root", "middle"]
        leafNodesData[1][0] = [55]
        leafNodesData[1].splice(1, 0, [60, insertionValue])
        middleKeys[1] = [60, 75, 85]
        break
      case 5: // Final State
        leafNodesData[1][0] = [55]
        leafNodesData[1].splice(1, 0, [60, insertionValue])
        middleKeys[1] = [60, 75, 85]
        break
    }
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      {/* Root Node */}
      <div className="flex justify-center mb-8">
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
            selectedNode === "root" ? "border-primary bg-primary/10" : "border-border bg-background"
          } ${searchPath.includes("root") ? "!border-chart-1 ring-2 ring-chart-1" : ""} ${
            highlightPath.includes("root") ? "!border-yellow-400 ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => !isSearch && setSelectedNode(selectedNode === "root" ? null : "root")}
        >
          <div className="text-center">
            <div className="text-sm font-medium text-primary">Root Node</div>
            <div className="flex gap-2 mt-2">
              {rootKeys.map((key) => (
                <span key={key} className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">{key}</span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Internal Node</div>
          </div>
        </div>
      </div>

      {/* Level 1 Nodes */}
      <div className="flex justify-center gap-8 mb-8">
        {["left", "middle", "right"].map((position, index) => (
          <div key={position} className="flex flex-col items-center">
            <div
              className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 ${
                selectedNode === position ? "border-secondary bg-secondary/10" : "border-border bg-background"
              } ${searchPath.includes(position) ? "!border-chart-1 ring-2 ring-chart-1" : ""} ${
                highlightPath.includes(position) ? "!border-yellow-400 ring-2 ring-yellow-400" : ""
              }`}
              onClick={() => !isSearch && setSelectedNode(selectedNode === position ? null : position)}
            >
              <div className="text-center">
                <div className="text-xs font-medium text-secondary">Internal Node</div>
                <div className="flex gap-1 mt-1">
                  {middleKeys[index].map((key) => (
                    <span key={key} className="px-1 py-0.5 bg-secondary/20 rounded text-xs font-mono">{key}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaf Nodes */}
            <div className="flex gap-2 mt-4">
              {leafNodesData[index].map((leaf, leafIndex) => {
                const leafId = `leaf-${index}-${leafIndex}`
                const isInRange = range && leaf.some((val) => val >= range[0] && val <= range[1])

                return (
                  <div
                    key={leafIndex}
                    className={`border rounded p-2 bg-muted/50 transition-all duration-300 ${
                      searchPath.includes(leafId) ? "!border-chart-1 ring-2 ring-chart-1" : "border-border"
                    } ${isInRange ? "bg-chart-1/20" : ""} ${
                      highlightPath.includes(leafId) ? "!border-yellow-400 ring-2 ring-yellow-400" : ""
                    }`}
                  >
                    <div className="text-xs text-center text-accent font-medium">Leaf Node</div>
                    <div className="flex flex-col gap-1 mt-1">
                      {leaf.map((val) => {
                        const isValInRange = range && val >= range[0] && val <= range[1]
                        const isNewValue = isInsertionAnimation && val === insertionValue && (insertionStep || 0) >= 2
                        return (
                          <span
                            key={val}
                            className={`px-1 py-0.5 rounded text-xs font-mono transition-all duration-300 ${
                              isValInRange ? "bg-chart-1 text-white" : "bg-accent/20"
                            } ${
                              isNewValue ? "!bg-green-500 text-white" : ""
                            }`}
                          >
                            {val}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Node Information */}
      {!isSearch && selectedNode && (
        <div className="mt-6 p-4 bg-popover rounded-lg border border-border">
          <h4 className="font-medium mb-2">Node Information</h4>
          <div className="text-sm text-popover-foreground">
            {selectedNode === "root" &&
              "Root node contains keys that divide the tree into subtrees. Each key represents the maximum value in its left subtree."}
            {selectedNode === "left" &&
              "Internal node managing keys 1-49. Contains pointers to leaf nodes with actual data."}
            {selectedNode === "middle" &&
              "Internal node managing keys 50-99. Balances the tree structure for optimal search performance."}
            {selectedNode === "right" &&
              "Internal node managing keys 100+. Maintains sorted order for efficient range queries."}
          </div>
        </div>
      )}
    </div>
  )
}
