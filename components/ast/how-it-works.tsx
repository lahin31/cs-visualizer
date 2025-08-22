"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const HowItWorks = () => {
  return (
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
  )
}
