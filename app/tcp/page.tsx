"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Network, Search, FileText, Play, BarChart3, Send, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const DataTransferVisualization = () => {
  const [packets, setPackets] = useState([
    { id: 1, seq: 1, status: "idle", ackStatus: "idle" },
    { id: 2, seq: 101, status: "idle", ackStatus: "idle" },
    { id: 3, seq: 201, status: "idle", ackStatus: "idle" },
    { id: 4, seq: 301, status: "idle", ackStatus: "idle" },
  ])
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    const resetPackets = packets.map((p) => ({ ...p, status: "idle", ackStatus: "idle" }))
    setPackets(resetPackets)

    resetPackets.forEach((packet, index) => {
      setTimeout(() => {
        setPackets((prev) => prev.map((p) => (p.id === packet.id ? { ...p, status: "sent" } : p)))
        setTimeout(() => {
          setPackets((prev) => prev.map((p) => (p.id === packet.id ? { ...p, ackStatus: "sent" } : p)))
          setTimeout(() => {
            setPackets((prev) =>
              prev.map((p) => (p.id === packet.id ? { ...p, status: "acknowledged", ackStatus: "received" } : p))
            )
            if (index === resetPackets.length - 1) {
              setIsPlaying(false)
            }
          }, 1000)
        }, 1000)
      }, index * 2500)
    })
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">TCP Data Flow</h3>
        <Button onClick={handlePlay} disabled={isPlaying}>
          <Play className="h-4 w-4 mr-2" />
          {isPlaying ? "Visualizing..." : "Visualize Data Transfer"}
        </Button>
      </div>
      <div className="relative h-80 border-2 border-dashed border-border rounded-lg p-4 bg-muted/50">
        <div className="flex justify-between h-full">
          {/* Client */}
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Client</div>
            <div className="text-sm text-muted-foreground">192.168.1.10</div>
            <div className="mt-4 space-y-2 w-full">
              {packets.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 bg-background rounded-md border">
                  <Send className={`h-5 w-5 ${p.status !== 'idle' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <div className="font-mono text-xs">SEQ: {p.seq}</div>
                    <div className="text-xs text-muted-foreground">Data Packet {p.id}</div>
                  </div>
                  {p.status === 'acknowledged' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                </div>
              ))}
            </div>
          </div>

          {/* Server */}
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Server</div>
            <div className="text-sm text-muted-foreground">10.0.0.1</div>
          </div>
        </div>

        {/* Packets Animation */}
        <div className="absolute top-0 left-0 w-full h-full">
          {packets.map((p, i) => (
            <div key={`anim-${p.id}`}>
              {/* Data Packet */}
              <motion.div
                className="absolute top-1/4 w-24 p-1 rounded-md bg-primary/80 text-primary-foreground text-center text-xs shadow-lg"
                style={{ top: `${20 + i * 15}%` }}
                initial={{ left: "15%", opacity: 0 }}
                animate={{
                  left: p.status === "sent" || p.status === "acknowledged" ? "60%" : "15%",
                  opacity: p.status === "sent" ? 1 : p.status === "acknowledged" ? 0 : 0,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                SEQ: {p.seq}
              </motion.div>
              {/* ACK Packet */}
              <motion.div
                className="absolute w-24 p-1 rounded-md bg-secondary/80 text-secondary-foreground text-center text-xs shadow-lg"
                style={{ top: `${20 + i * 15}%` }}
                initial={{ right: "15%", opacity: 0 }}
                animate={{
                  right: p.ackStatus === "sent" || p.ackStatus === "received" ? "60%" : "15%",
                  opacity: p.ackStatus === "sent" ? 1 : p.ackStatus === "received" ? 0 : 0,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                ACK: {p.seq + 100}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ThreeWayHandshakeVisualization = () => {
  const [step, setStep] = useState(0) // 0: idle, 1: SYN, 2: SYN-ACK, 3: ACK, 4: complete
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    setStep(1)
    setTimeout(() => setStep(2), 1500)
    setTimeout(() => setStep(3), 3000)
    setTimeout(() => {
      setStep(4)
      setIsPlaying(false)
    }, 4500)
    setTimeout(() => setStep(0), 6000) // Reset after a delay
  }

  const getStatusText = () => {
    switch (step) {
      case 1:
        return "Client sends SYN to Server..."
      case 2:
        return "Server receives SYN, sends SYN-ACK to Client..."
      case 3:
        return "Client receives SYN-ACK, sends ACK to Server..."
      case 4:
        return "Connection Established!"
      default:
        return "Ready to start handshake."
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Handshake Process</h3>
        <Button onClick={handlePlay} disabled={isPlaying}>
          <Play className="h-4 w-4 mr-2" />
          {isPlaying ? "Visualizing..." : "Start Handshake"}
        </Button>
      </div>
      <div className="relative h-60 border-2 border-dashed border-border rounded-lg p-4 bg-muted/50">
        <div className="flex justify-between h-full">
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Client</div>
          </div>
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Server</div>
          </div>
        </div>

        {/* SYN Packet */}
        <motion.div
          className="absolute top-1/4 w-24 p-1 rounded-md bg-blue-500/80 text-white text-center text-xs shadow-lg"
          initial={{ left: "15%", opacity: 0 }}
          animate={{
            left: step >= 1 ? "60%" : "15%",
            opacity: step === 1 ? 1 : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          SYN
        </motion.div>

        {/* SYN-ACK Packet */}
        <motion.div
          className="absolute top-1/2 w-24 p-1 rounded-md bg-green-500/80 text-white text-center text-xs shadow-lg"
          initial={{ right: "15%", opacity: 0 }}
          animate={{
            right: step >= 2 ? "60%" : "15%",
            opacity: step === 2 ? 1 : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          SYN-ACK
        </motion.div>

        {/* ACK Packet */}
        <motion.div
          className="absolute top-3/4 w-24 p-1 rounded-md bg-blue-500/80 text-white text-center text-xs shadow-lg"
          initial={{ left: "15%", opacity: 0 }}
          animate={{
            left: step >= 3 ? "60%" : "15%",
            opacity: step === 3 ? 1 : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          ACK
        </motion.div>
      </div>
      <div className="mt-4 text-center text-muted-foreground font-medium">{getStatusText()}</div>
    </div>
  )
}

export default function TcpPage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { id: 0, title: "Three-way Handshake", icon: Play, color: "bg-primary" },
    { id: 1, title: "Data Transfer", icon: BarChart3, color: "bg-secondary" },
    { id: 2, title: "Connection Termination", icon: FileText, color: "bg-accent" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">TCP Protocol</h1>
              <p className="text-muted-foreground">Interactive visualization of TCP Protocol</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">TCP Visualization</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore the TCP protocol through interactive visualizations and step-by-step examples.
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
        {activeStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Three-way Handshake</CardTitle>
              <CardDescription>Visualization of the SYN, SYN-ACK, ACK process.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThreeWayHandshakeVisualization />
            </CardContent>
          </Card>
        )}
        {activeStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Data Transfer</CardTitle>
              <CardDescription>Visualization of data packets being sent and acknowledged.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTransferVisualization />
            </CardContent>
          </Card>
        )}
        {activeStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Connection Termination</CardTitle>
              <CardDescription>Visualization of the FIN, ACK, FIN, ACK process.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content for Connection Termination goes here.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
