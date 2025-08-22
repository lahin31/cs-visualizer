"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const About = () => {
  return (
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
  )
}
