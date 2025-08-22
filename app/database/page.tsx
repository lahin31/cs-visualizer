"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, Search, FileText, TreePine, Play, BarChart3, TrendingUp, Activity, Zap, Cpu, HardDrive } from "lucide-react"
import Link from "next/link"
import { BPlusTreeVisualization } from "@/components/database/b-plus-tree-visualization"
import { WalVisualization } from "@/components/database/wal-visualization"
import { QueryVisualization } from "@/components/database/query-visualization"

export default function DatabasePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [queryStep, setQueryStep] = useState(0)
  const [searchValue, setSearchValue] = useState("75")
  const [searchPath, setSearchPath] = useState<string[]>([])
  const [range, setRange] = useState<[number, number] | null>([30, 80])
  const [insertionValue, setInsertionValue] = useState(65)
  const [insertionStep, setInsertionStep] = useState(0)

  const handleSearch = () => {
    const value = parseInt(searchValue)
    setSearchPath([])

    if (isNaN(value)) {
      return
    }

    const path: string[] = ["root"]
    if (value < 50) {
      path.push("left")
      if (value < 25) path.push("leaf-0-0")
      else if (value < 35) path.push("leaf-0-1")
      else path.push("leaf-0-2")
    } else if (value < 100) {
      path.push("middle")
      if (value < 75) path.push("leaf-1-0")
      else if (value < 85) path.push("leaf-1-1")
      else path.push("leaf-1-2")
    } else {
      path.push("right")
      if (value < 125) path.push("leaf-2-0")
      else if (value < 150) path.push("leaf-2-1")
      else path.push("leaf-2-2")
    }

    path.forEach((node, index) => {
      setTimeout(() => {
        setSearchPath((prev) => [...prev, node])
      }, index * 500)
    })
  }

  const steps = [
    { id: 0, title: "B+ Tree Basics", icon: TreePine, color: "bg-primary" },
    { id: 1, title: "Insertion & WAL", icon: Search, color: "bg-secondary" },
    { id: 2, title: "Deletion", icon: Database, color: "bg-accent" },
    { id: 3, title: "Search & Range", icon: Play, color: "bg-chart-1" },
  ]

  const insertionSteps = [
    "Initial State",
    "Find Leaf Node",
    "Insert Key (Overflow)",
    "Split Node",
    "Promote Key",
    "Final State",
  ]

  const querySteps = [
    "Parse SQL Query",
    "Query Optimization",
    "Execution Plan",
    "Index Lookup",
    "Data Retrieval",
    "Result Assembly",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Database Architecture</h1>
              <p className="text-muted-foreground">Interactive visualization of SQL Database Architecture</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">B+ Tree Data Structure</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore the B+ tree data structure used in database indexing through interactive visualizations and
            step-by-step examples.
          </p>

          {/* Process Overview Diagram */}
          <div className="bg-card rounded-lg p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-2 cursor-pointer transition-all duration-300 ${
                      activeStep === index ? step.color : "bg-muted-foreground/30"
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="container mx-auto px-4 py-12">
        {/* B+ Tree Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              B+ Tree Overview
            </CardTitle>
            <CardDescription>
              Visual representation of B+ tree structure and its key properties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Internal Nodes */}
              <div className="text-center">
                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-3">
                  <div className="text-2xl mb-2">🌳</div>
                  <h4 className="font-semibold text-blue-800">Internal Nodes</h4>
                  <p className="text-xs text-blue-600 mt-1">Routing & Navigation</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Store keys for navigation,<br />
                  point to child nodes
                </div>
              </div>

              {/* Leaf Nodes */}
              <div className="text-center">
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-3">
                  <div className="text-2xl mb-2">🍃</div>
                  <h4 className="font-semibold text-green-800">Leaf Nodes</h4>
                  <p className="text-xs text-green-600 mt-1">Data Storage</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Store actual data records,<br />
                  linked for range queries
                </div>
              </div>

              {/* Balanced Structure */}
              <div className="text-center">
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-3">
                  <div className="text-2xl mb-2">⚖️</div>
                  <h4 className="font-semibold text-purple-800">Balanced Structure</h4>
                  <p className="text-xs text-purple-600 mt-1">Self-Balancing</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  All leaf nodes at same level,<br />
                  optimal search performance
                </div>
              </div>
            </div>

            {/* B+ Tree Flow */}
            <div className="flex justify-center items-center mt-6 space-x-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-300"></div>
                <div className="text-xs text-muted-foreground">Key Navigation</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-300"></div>
                <div className="text-xs text-muted-foreground">Data Retrieval</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-purple-300"></div>
                <div className="text-xs text-muted-foreground">Range Queries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How B+ Trees Connect to Indexing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              How B+ Trees Power Database Indexing
            </CardTitle>
            <CardDescription>
              Connecting the B+ Tree data structure to its role in creating fast, efficient database indexes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-lg font-semibold mb-4">From Query to Data Retrieval</h3>
                <div className="relative border-l-2 border-primary/20 pl-6 space-y-8">
                  {/* Step 1: Query */}
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 bg-primary rounded-full"></div>
                    <h4 className="font-semibold">1. SQL Query</h4>
                    <p className="text-sm text-muted-foreground">A `SELECT` statement with a `WHERE` clause is issued to find specific data.</p>
                    <code className="text-xs bg-muted p-1 rounded mt-1 inline-block">SELECT * FROM users WHERE age > 30</code>
                  </div>

                  {/* Step 2: Index Lookup */}
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 bg-secondary rounded-full"></div>
                    <h4 className="font-semibold">2. B+ Tree Index Lookup</h4>
                    <p className="text-sm text-muted-foreground">The database uses the B+ tree index on the `age` column to quickly find matching leaf nodes.</p>
                  </div>

                  {/* Step 3: Pointer to Data */}
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 bg-accent rounded-full"></div>
                    <h4 className="font-semibold">3. Leaf Node Pointers</h4>
                    <p className="text-sm text-muted-foreground">Leaf nodes contain pointers (e.g., row IDs) to the actual data rows stored on disk.</p>
                  </div>

                  {/* Step 4: Data Fetch */}
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 bg-chart-1 rounded-full"></div>
                    <h4 className="font-semibold">4. Disk I/O</h4>
                    <p className="text-sm text-muted-foreground">The database performs minimal disk reads to fetch only the required data rows.</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 text-center">Index Data Structure</h3>
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 mb-2">
                    <div className="bg-blue-100 text-blue-800 text-xs font-bold p-2 rounded-md">Index Key (e.g., Age)</div>
                    <div className="bg-green-100 text-green-800 text-xs font-bold p-2 rounded-md">Row Pointer</div>
                  </div>
                  <div className="text-2xl">⬇️</div>
                  <div className="bg-card p-4 rounded-lg shadow-md w-full">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <span className="text-sm font-mono">32</span>
                      <span className="text-sm font-mono text-muted-foreground">0x1A2B3C</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <span className="text-sm font-mono">45</span>
                      <span className="text-sm font-mono text-muted-foreground">0x4D5E6F</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-mono">51</span>
                      <span className="text-sm font-mono text-muted-foreground">0x7G8H9I</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">Leaf nodes store key-pointer pairs, linking indexed values to physical data locations.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B+ Tree Basics Section */}
        {activeStep === 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-6 w-6 text-primary" />
                Interactive B+ Tree Visualization
              </CardTitle>
              <CardDescription>
                Explore the structure and properties of B+ trees through interactive visualization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Interactive B+ Tree Visualization */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interactive B+ Tree</h3>
                  <BPlusTreeVisualization />
                </div>

                {/* B+ Tree Properties */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">B+ Tree Properties</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>All leaf nodes at same level</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span>Keys stored in sorted order</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Self-balancing structure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                        <span>Leaf nodes linked for range queries</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Search Complexity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Search Time</span>
                        <Badge variant="outline">O(log n)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Insert Time</span>
                        <Badge variant="outline">O(log n)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Delete Time</span>
                        <Badge variant="outline">O(log n)</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Range Query</span>
                        <Badge variant="outline">O(log n + k)</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* B+ Tree Insertion & WAL Section */}
        {activeStep === 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-6 w-6 text-secondary" />
                B+ Tree Insertion & WAL
              </CardTitle>
              <CardDescription>
                How B+ trees handle insertions and the role of Write Ahead Log in database reliability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">B+ Tree Insertion Process</h3>
                  <div className="border border-border rounded-lg p-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <div className="flex-1 bg-blue-50 p-2 rounded">
                          <div className="text-xs font-medium text-blue-800">Find Leaf Node</div>
                          <div className="text-xs text-blue-600">Traverse tree to appropriate leaf</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">2</span>
                        </div>
                        <div className="flex-1 bg-green-50 p-2 rounded">
                          <div className="text-xs font-medium text-green-800">Insert Key</div>
                          <div className="text-xs text-green-600">Add key in sorted order</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600">3</span>
                        </div>
                        <div className="flex-1 bg-purple-50 p-2 rounded">
                          <div className="text-xs font-medium text-purple-800">Split if Full</div>
                          <div className="text-xs text-purple-600">Split node and propagate up</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-600">4</span>
                        </div>
                        <div className="flex-1 bg-orange-50 p-2 rounded">
                          <div className="text-xs font-medium text-orange-800">Update Links</div>
                          <div className="text-xs text-orange-600">Maintain leaf node chain</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Insertion Example: Key 65</h4>
                    <BPlusTreeVisualization isInsertionAnimation insertionStep={insertionStep} insertionValue={insertionValue} />
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Animation Step:</span>
                        <Badge variant="secondary">{insertionSteps[insertionStep]}</Badge>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setInsertionStep(Math.max(0, insertionStep - 1))} disabled={insertionStep === 0}>Prev</Button>
                        <Button size="sm" onClick={() => setInsertionStep(Math.min(insertionSteps.length - 1, insertionStep + 1))} disabled={insertionStep === insertionSteps.length - 1}>Next</Button>
                        <Button size="sm" variant="ghost" onClick={() => setInsertionStep(0)}>Reset</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Write Ahead Log (WAL)</h3>
                  <div className="border border-border rounded-lg p-4">
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">WAL Structure</div>
                      <div className="space-y-1">
                        <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
                          BEGIN TRANSACTION
                        </div>
                        <div className="h-6 bg-secondary/30 border border-secondary rounded flex items-center px-2 text-xs">
                          INSERT INTO users (id, name) VALUES (101, 'Alice')
                        </div>
                        <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
                          UPDATE B+ tree: Add key 101
                        </div>
                        <div className="h-6 bg-primary/20 rounded flex items-center px-2 text-xs">
                          COMMIT TRANSACTION
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      WAL ensures durability: Changes logged before applying to B+ tree
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">WAL Recovery Process</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                        <span className="text-sm">Crash Recovery</span>
                        <Badge variant="destructive">Redo Log</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                        <span className="text-sm">Rollback</span>
                        <Badge
                          style={{
                            backgroundColor: "hsl(var(--secondary))",
                            color: "hsl(var(--secondary-foreground))",
                          }}
                        >
                          Undo Log
                        </Badge>
                      </div>
                    </div>

                    {/* WAL Performance Chart */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-3">WAL vs Direct Writes</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 text-xs text-muted-foreground">Direct</div>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div className="bg-destructive h-3 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                          <div className="w-12 text-xs text-muted-foreground">100ms</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 text-xs text-muted-foreground">WAL</div>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div className="bg-secondary h-3 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                          <div className="w-12 text-xs text-muted-foreground">30ms</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-destructive rounded"></div>
                          <span>Direct Writes (Slower)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-secondary rounded"></div>
                          <span>WAL (Faster + Safe)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* B+ Tree Deletion Section */}
        {activeStep === 2 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-accent" />
                B+ Tree Deletion
              </CardTitle>
              <CardDescription>
                How B+ trees handle deletions while maintaining balance and performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Deletion Process</h3>
                  <div className="border border-border rounded-lg p-6 bg-card">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-red-600">1</span>
                        </div>
                        <div className="flex-1 bg-red-50 p-2 rounded">
                          <div className="text-xs font-medium text-red-800">Find Key</div>
                          <div className="text-xs text-red-600">Locate key in leaf node</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-yellow-600">2</span>
                        </div>
                        <div className="flex-1 bg-yellow-50 p-2 rounded">
                          <div className="text-xs font-medium text-yellow-800">Remove Key</div>
                          <div className="text-xs text-yellow-600">Delete from leaf node</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <div className="flex-1 bg-blue-50 p-2 rounded">
                          <div className="text-xs font-medium text-blue-800">Rebalance</div>
                          <div className="text-xs text-blue-600">Merge or redistribute if needed</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">4</span>
                        </div>
                        <div className="flex-1 bg-green-50 p-2 rounded">
                          <div className="text-xs font-medium text-green-800">Update Links</div>
                          <div className="text-xs text-green-600">Maintain leaf node chain</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Deletion Strategies</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Simple deletion (leaf has enough keys)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Borrow from sibling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Merge with sibling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Propagate changes upward</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Deletion Example</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-muted p-2 rounded">
                        <span className="font-mono">Before: [10, 20] [30, 40] [50, 60]</span>
                      </div>
                      <div className="bg-red-50 p-2 rounded border border-red-200">
                        <span className="font-mono">Delete 30: [10, 20] [40] [50, 60]</span>
                      </div>
                      <div className="bg-blue-50 p-2 rounded border border-blue-200">
                        <span className="font-mono">Merge: [10, 20, 40] [50, 60]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Range Section */}
        {activeStep === 3 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6 text-chart-1" />
                B+ Tree Search & Range Queries
              </CardTitle>
              <CardDescription>
                How B+ trees efficiently handle point lookups and range queries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QueryVisualization 
                searchValue={searchValue} 
                setSearchValue={setSearchValue} 
                handleSearch={handleSearch} 
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="bg-primary hover:bg-primary/90"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  )
}
