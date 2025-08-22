"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export const UdpDatagramVisualization = () => {
  const [isSending, setIsSending] = useState(false)

  const datagramFields = [
    { name: "Source Port", value: "49152", size: 16, color: "bg-blue-500/20" },
    { name: "Destination Port", value: "53", size: 16, color: "bg-green-500/20" },
    { name: "Length", value: "28", size: 16, color: "bg-yellow-500/20" },
    { name: "Checksum", value: "0x8e7f", size: 16, color: "bg-red-500/20" },
    { name: "Data", value: '"Query: example.com"', size: 160, color: "bg-purple-500/20" },
  ]

  const handleSend = () => {
    setIsSending(true)
    setTimeout(() => setIsSending(false), 2000)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">UDP Datagram Structure</h3>
        <Button onClick={handleSend} disabled={isSending}>
          <Send className="h-4 w-4 mr-2" />
          {isSending ? "Sending..." : "Send Datagram"}
        </Button>
      </div>

      {/* Datagram Structure */}
      <motion.div
        className="flex border-2 border-border rounded-lg overflow-hidden mb-8 bg-card"
        animate={{ scale: isSending ? 1.02 : 1 }}
        transition={{ duration: 0.8, yoyo: Infinity, ease: "easeInOut" }}
      >
        {datagramFields.map((field, index) => (
          <div
            key={index}
            className={`p-3 text-center border-r border-border last:border-r-0 ${field.color}`}
            style={{ flexGrow: field.size }}
          >
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">{field.name}</div>
            <div className="text-sm font-mono text-muted-foreground mt-1">{field.value}</div>
            <div className="text-xs text-muted-foreground/50">({field.size / 8} bytes)</div>
          </div>
        ))}
      </motion.div>

      {/* Animation */}
      <div className="relative h-40 border-2 border-dashed border-border rounded-lg p-4 bg-muted/50">
        <div className="flex justify-between h-full">
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Client</div>
          </div>
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Server</div>
          </div>
        </div>

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-32 p-2 rounded-md bg-purple-500/80 text-white text-center text-sm shadow-lg"
          initial={{ left: "15%", opacity: 0 }}
          animate={{
            left: isSending ? "60%" : "15%",
            opacity: isSending ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            opacity: { times: [0, 0.1, 0.9, 1] },
          }}
        >
          UDP Datagram
        </motion.div>
      </div>
    </div>
  )
}
