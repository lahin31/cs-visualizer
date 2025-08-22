"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export const ThreeWayHandshakeVisualization = () => {
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
