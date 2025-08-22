"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Send, CheckCircle2 } from "lucide-react"

export const DataTransferVisualization = () => {
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
