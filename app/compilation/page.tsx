"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Code, Cpu, FileText, Link, Play, ArrowDown, ArrowRight, Zap, Database, Binary, Settings } from "lucide-react"

const compilationStages = [
  {
    id: "source",
    title: "Source Code",
    description: "Human-readable Python code written in an IDE",
    icon: <Code className="w-6 h-6" />,
    color: "bg-primary",
    example: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(f"Fibonacci result: {result}")`,
  },
  {
    id: "parsing",
    title: "Parsing",
    description: "Python code parsed into Abstract Syntax Tree (AST)",
    icon: <FileText className="w-6 h-6" />,
    color: "bg-secondary",
    example: `Module(
  body=[
    FunctionDef(
      name='fibonacci',
      args=arguments(
        args=[arg(arg='n', annotation=None)],
        defaults=[],
        kwonlyargs=[],
        kw_defaults=[],
        kwarg=None,
        vararg=None
      ),
      body=[
        If(
          test=Compare(
            left=Name(id='n', ctx=Load()),
            ops=[LtE()],
            comparators=[Constant(value=1)]
          ),
          body=[Return(value=Name(id='n', ctx=Load()))],
          orelse=[]
        ),
        Return(
          value=BinOp(
            left=Call(
              func=Name(id='fibonacci', ctx=Load()),
              args=[BinOp(left=Name(id='n', ctx=Load()), op=Sub(), right=Constant(value=1))],
              keywords=[]
            ),
            op=Add(),
            right=Call(
              func=Name(id='fibonacci', ctx=Load()),
              args=[BinOp(left=Name(id='n', ctx=Load()), op=Sub(), right=Constant(value=2))],
              keywords=[]
            )
          )
        )
      ],
      decorator_list=[],
      returns=None
    ),
    Assign(
      targets=[Name(id='result', ctx=Store())],
      value=Call(
        func=Name(id='fibonacci', ctx=Load()),
        args=[Constant(value=10)],
        keywords=[]
      )
    ),
    Expr(
      value=Call(
        func=Name(id='print', ctx=Load()),
        args=[JoinedStr(values=[Constant(value='Fibonacci result: '), FormattedValue(value=Name(id='result', ctx=Load()), conversion=-1, format_spec=None)])],
        keywords=[]
      )
    )
  ]
)`,
  },
  {
    id: "bytecode",
    title: "Bytecode Compilation",
    description: "AST compiled to Python bytecode (.pyc files) - COMPILATION PHASE",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-accent",
    example: `  1           0 LOAD_CONST               0 (<code object fibonacci>)
              2 LOAD_CONST               1 ('fibonacci')
              4 MAKE_FUNCTION            0
              6 STORE_NAME               0 (fibonacci)

  6           8 LOAD_NAME                0 (fibonacci)
             10 LOAD_CONST               2 (10)
             12 CALL_FUNCTION            1
             14 STORE_NAME               1 (result)

  7          16 LOAD_NAME                2 (print)
             18 LOAD_CONST               3 ('Fibonacci result: ')
             20 LOAD_NAME                1 (result)
             22 FORMAT_VALUE             0
             24 BUILD_STRING             2
             26 CALL_FUNCTION            1
             28 POP_TOP
             30 LOAD_CONST               4 (None)
             32 RETURN_VALUE`,
  },
  {
    id: "pyc",
    title: "Python Bytecode",
    description: "Compiled bytecode stored in .pyc files with metadata",
    icon: <FileText className="w-6 h-6" />,
    color: "bg-chart-1",
    example: `Python bytecode file (.pyc):
- Magic number: 0x0a0d0c0a
- Timestamp: 2024-01-15 10:30:45
- Source size: 156 bytes
- Bytecode instructions
- Constants table
- Names table
- Variable names
- Line number table`,
  },
  {
    id: "interpretation",
    title: "Bytecode Interpretation",
    description: "Python VM interprets bytecode instructions - INTERPRETATION PHASE",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-chart-3",
    example: `Python Virtual Machine:
- Stack-based execution
- Dynamic typing
- Garbage collection
- Built-in functions
- Standard library modules
- Runtime optimization

Execution flow:
1. Load bytecode into VM
2. Execute instructions sequentially
3. Manage memory and objects
4. Handle exceptions
5. Return results`,
  },
  {
    id: "cython",
    title: "Cython Compilation",
    description: "Python code compiled to C, then to machine code",
    icon: <Binary className="w-6 h-6" />,
    color: "bg-purple-600",
    example: `# Cython (.pyx file)
cdef int fibonacci(int n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Generated C code
static int __pyx_f_9fibonacci_fibonacci(int __pyx_v_n) {
    int __pyx_r;
    if (__pyx_v_n <= 1) {
        __pyx_r = __pyx_v_n;
        goto __pyx_L0;
    }
    __pyx_r = __pyx_f_9fibonacci_fibonacci(__pyx_v_n - 1) + 
              __pyx_f_9fibonacci_fibonacci(__pyx_v_n - 2);
    __pyx_L0: return __pyx_r;
}

# Machine code (x86-64)
55 48 89 e5 83 ff 01 7f 05 89 f8 5d c3
53 48 83 ec 08 8d 7f ff e8 00 00 00 00...`,
  },
  {
    id: "pyinstaller",
    title: "PyInstaller Bundling",
    description: "Python bytecode bundled into standalone executable",
    icon: <Settings className="w-6 h-6" />,
    color: "bg-orange-600",
    example: `PyInstaller Executable:
- Python interpreter
- All bytecode (.pyc files)
- Required libraries
- Runtime dependencies
- Resource files
- Bootloader

File structure:
myapp.exe (Windows)
├── Python DLLs
├── Standard library
├── Third-party packages
├── Application bytecode
└── Bootloader`,
  },
]

export default function CompilationPage() {
  const [activeStage, setActiveStage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (activeStage < compilationStages.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveStage(activeStage + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (activeStage > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveStage(activeStage - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleReset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveStage(0)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Understanding Python's Hybrid Compilation-Interpretation Model</h1>
          <p className="text-xl opacity-90">From Source Code to Multiple Execution Paths</p>
        </div>
      </div>

      {/* Compilation Pipeline Visualization */}
      <div className="w-full px-4 md:px-6 py-6 md:py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Python Compilation & Interpretation Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 p-4 md:p-6">
              {compilationStages.map((stage, index) => (
                <div key={stage.id} className="flex flex-col md:flex-row items-center flex-shrink-0">
                  {/* Stage Box */}
                  <div
                    className={`relative p-4 md:p-6 rounded-lg border-2 transition-all duration-500 w-full max-w-[180px] ${
                      index === activeStage
                        ? "border-primary bg-primary/10 scale-105 shadow-lg"
                        : index < activeStage
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white mb-2 md:mb-3 ${
                          index <= activeStage ? stage.color : "bg-gray-400"
                        }`}
                      >
                        {stage.icon}
                      </div>
                      <h3 className="font-semibold text-xs md:text-sm">{stage.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-24">
                        {stage.description.split(" ").slice(0, 3).join(" ")}...
                      </p>
                    </div>

                    {/* Animated pulse for active stage */}
                    {index === activeStage && (
                      <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse opacity-50"></div>
                    )}
                  </div>

                  {/* Arrow between stages */}
                  {index < compilationStages.length - 1 && (
                    <div className="flex items-center justify-center p-2">
                      <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-gray-400 hidden md:block" />
                      <ArrowDown className="w-4 h-4 md:w-6 md:h-6 text-gray-400 md:hidden" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Execution Paths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Python Execution Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Standard Python Path */}
              <div className="text-center">
                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-2">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-blue-800">Standard Python</p>
                  <p className="text-xs text-blue-600">Compile → Interpret</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Source → Bytecode → VM
                  <br />
                  (Most common path)
                </div>
              </div>

              {/* Cython Path */}
              <div className="text-center">
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-2">
                  <Binary className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold text-purple-800">Cython</p>
                  <p className="text-xs text-purple-600">Compile → Machine Code</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Python → C → Machine Code
                  <br />
                  (Performance optimization)
                </div>
              </div>

              {/* PyInstaller Path */}
              <div className="text-center">
                <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 mb-2">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="font-semibold text-orange-800">PyInstaller</p>
                  <p className="text-xs text-orange-600">Bundle → Executable</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Bytecode + Interpreter
                  <br />
                  (Distribution)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Layout & File Transformation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Python File Transformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Input File */}
              <div className="text-center">
                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-2">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-blue-800">Source File</p>
                  <p className="text-xs text-blue-600">script.py</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Human-readable
                  <br />Python source code
                </div>
              </div>

              {/* Transformation Arrow */}
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-100 border border-yellow-300 rounded px-3 py-1 mb-2">
                    <Cpu className="w-5 h-5 text-yellow-600" />
                  </div>
                  <ArrowDown className="w-4 h-4 text-gray-400 mb-2" />
                  <div className="text-xs text-center text-muted-foreground">
                    Python Compiler
                    <br />
                    (CPython)
                  </div>
                </div>
              </div>

              {/* Output File */}
              <div className="text-center">
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-2">
                  <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold text-green-800">Bytecode</p>
                  <p className="text-xs text-green-600">__pycache__/script.pyc</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Python bytecode
                  <br />
                  Executed by VM
                </div>
              </div>
            </div>

            {/* Detailed File Format Visualization */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Python Source Structure</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <span className="text-sm">Import statements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-sm">Function definitions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-sm">Class definitions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span className="text-sm">Main execution code</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Python Bytecode Structure</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-sm">Magic number & metadata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span className="text-sm">Constants table</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span className="text-sm">Names table</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                    <span className="text-sm">Bytecode instructions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <Button onClick={handlePrevious} disabled={activeStage === 0} variant="outline">
              Previous
            </Button>
            <Button onClick={handleNext} disabled={activeStage === compilationStages.length - 1}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <Button onClick={handleReset} variant="secondary">
            <Play className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {compilationStages.map((stage, index) => (
              <div key={stage.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                    index <= activeStage ? stage.color : "bg-muted"
                  }`}
                >
                  {stage.icon}
                </div>
                <span className="text-sm mt-2 font-medium">{stage.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((activeStage + 1) / compilationStages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Stage Display */}
        <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${compilationStages[activeStage].color}`}
                >
                  {compilationStages[activeStage].icon}
                </div>
                <div>
                  <CardTitle className="text-2xl">{compilationStages[activeStage].title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{compilationStages[activeStage].description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-card p-6 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{compilationStages[activeStage].example}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>What Happens Here?</CardTitle>
            </CardHeader>
            <CardContent>
              {activeStage === 0 && (
                <div className="space-y-4">
                  <p>
                    The developer writes Python source code in an Integrated Development Environment (IDE) like PyCharm,
                    Visual Studio Code, or Jupyter Notebook.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Human-readable Python syntax</li>
                    <li>High-level abstractions</li>
                    <li>Dynamic typing</li>
                    <li>Indentation-based structure</li>
                  </ul>
                </div>
              )}
              {activeStage === 1 && (
                <div className="space-y-4">
                  <p>The Python parser converts source code into an Abstract Syntax Tree (AST).</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Lexical analysis (tokenization)</li>
                    <li>Syntactic analysis (parsing)</li>
                    <li>AST construction</li>
                    <li>Syntax validation</li>
                  </ul>
                </div>
              )}
              {activeStage === 2 && (
                <div className="space-y-4">
                  <p>
                    <strong>COMPILATION PHASE:</strong> The Python compiler (CPython) translates the AST into bytecode instructions for the Python Virtual Machine.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>AST traversal and optimization</li>
                    <li>Bytecode instruction generation</li>
                    <li>Constant folding</li>
                    <li>Symbol table creation</li>
                  </ul>
                </div>
              )}
              {activeStage === 3 && (
                <div className="space-y-4">
                  <p>The bytecode is stored in .pyc files with metadata for faster loading.</p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Magic number for version compatibility</li>
                    <li>Source file timestamp</li>
                    <li>Source file size</li>
                    <li>Compressed bytecode data</li>
                  </ul>
                </div>
              )}
              {activeStage === 4 && (
                <div className="space-y-4">
                  <p>
                    <strong>INTERPRETATION PHASE:</strong> The Python Virtual Machine executes the bytecode instructions.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Stack-based execution model</li>
                    <li>Dynamic memory management</li>
                    <li>Garbage collection</li>
                    <li>Built-in function calls</li>
                  </ul>
                </div>
              )}
              {activeStage === 5 && (
                <div className="space-y-4">
                  <p>
                    <strong>MACHINE CODE COMPILATION:</strong> Cython compiles Python code to C, then to native machine code for performance.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Static typing with cdef</li>
                    <li>C code generation</li>
                    <li>Native compilation</li>
                    <li>Performance optimization</li>
                  </ul>
                </div>
              )}
              {activeStage === 6 && (
                <div className="space-y-4">
                  <p>
                    <strong>EXECUTABLE BUNDLING:</strong> PyInstaller bundles Python bytecode and interpreter into standalone executables.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Dependency analysis</li>
                    <li>Bytecode bundling</li>
                    <li>Interpreter packaging</li>
                    <li>Cross-platform distribution</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools & Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeStage === 0 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      IDE Tools
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <p className="font-medium mb-2">Popular Python IDEs:</p>
                      <ul className="space-y-1">
                        <li>• PyCharm</li>
                        <li>• Visual Studio Code</li>
                        <li>• Jupyter Notebook</li>
                        <li>• Spyder</li>
                      </ul>
                    </div>
                  </div>
                )}
                {activeStage === 1 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      AST Module
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <code>import ast<br />
                      tree = ast.parse(source_code)</code>
                      <p className="mt-2">Python's built-in AST module</p>
                    </div>
                  </div>
                )}
                {activeStage === 2 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Compile Function
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <code>compile(source, filename, mode)</code>
                      <p className="mt-2">Python's built-in compile function</p>
                    </div>
                  </div>
                )}
                {activeStage === 3 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Py_CompileString
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <code>import py_compile<br />
                      py_compile.compile('script.py')</code>
                      <p className="mt-2">Generate .pyc files</p>
                    </div>
                  </div>
                )}
                {activeStage === 4 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Python VM
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <code>python script.py</code>
                      <p className="mt-2">Execute Python bytecode</p>
                    </div>
                  </div>
                )}
                {activeStage === 5 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Cython
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <code>cythonize script.pyx<br />
                      python setup.py build_ext</code>
                      <p className="mt-2">Compile to machine code</p>
                    </div>
                  </div>
                )}
                {activeStage === 6 && (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      PyInstaller
                    </Badge>
                    <div className="bg-card p-4 rounded text-sm">
                      <code>pyinstaller --onefile script.py</code>
                      <p className="mt-2">Create standalone executable</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Python's Hybrid Model: Compilation + Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-card p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Standard Python (CPython)</h4>
                  <code className="text-lg">python script.py</code>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Compiles to bytecode, then interprets bytecode
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Performance Tools</h4>
                  <code className="text-lg">cython script.pyx</code>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Compiles Python to machine code for speed
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                Python is both compiled and interpreted: it compiles source code to bytecode, then interprets that bytecode. 
                Tools like Cython and PyInstaller provide additional compilation and distribution options.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
