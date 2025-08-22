"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export const ConnectionTerminationVisualization = () => {
  const [step, setStep] = useState(0) // 0: idle, 1: FIN, 2: ACK, 3: FIN, 4: ACK, 5: complete
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    setStep(1)
    setTimeout(() => setStep(2), 1500)
    setTimeout(() => setStep(3), 3000)
    setTimeout(() => setStep(4), 4500)
    setTimeout(() => {
      setStep(5)
      setIsPlaying(false)
    }, 6000)
    setTimeout(() => setStep(0), 7500) // Reset
  }

  const getStatusText = () => {
    switch (step) {
      case 1:
        return "Client sends FIN to Server..."
      case 2:
        return "Server acknowledges with ACK..."
      case 3:
        return "Server sends its own FIN..."
      case 4:
        return "Client acknowledges with ACK..."
      case 5:
        return "Connection Closed."
      default:
        return "Ready to terminate connection."
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Termination Process</h3>
        <Button onClick={handlePlay} disabled={isPlaying}>
          <Play className="h-4 w-4 mr-2" />
          {isPlaying ? "Visualizing..." : "Start Termination"}
        </Button>
      </div>
      <div className="relative h-80 border-2 border-dashed border-border rounded-lg p-4 bg-muted/50">
        <div className="flex justify-between h-full">
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Client</div>
          </div>
          <div className="w-1/4 flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">Server</div>
          </div>
        </div>

        {/* FIN from Client */}
        <motion.div
          className="absolute w-24 p-1 rounded-md bg-red-500/80 text-white text-center text-xs shadow-lg"
          style={{ top: '15%' }}
          initial={{ left: "15%", opacity: 0 }}
          animate={{ left: step >= 1 ? "60%" : "15%", opacity: step === 1 ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          FIN
        </motion.div>

        {/* ACK from Server */}
        <motion.div
          className="absolute w-24 p-1 rounded-md bg-gray-500/80 text-white text-center text-xs shadow-lg"
          style={{ top: '35%' }}
          initial={{ right: "15%", opacity: 0 }}
          animate={{ right: step >= 2 ? "60%" : "15%", opacity: step === 2 ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          ACK
        </motion.div>

        {/* FIN from Server */}
        <motion.div
          className="absolute w-24 p-1 rounded-md bg-red-500/80 text-white text-center text-xs shadow-lg"
          style={{ top: '55%' }}
          initial={{ right: "15%", opacity: 0 }}
          animate={{ right: step >= 3 ? "60%" : "15%", opacity: step === 3 ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          FIN
        </motion.div>

        {/* ACK from Client */}
        <motion.div
          className="absolute w-24 p-1 rounded-md bg-gray-500/80 text-white text-center text-xs shadow-lg"
          style={{ top: '75%' }}
          initial={{ left: "15%", opacity: 0 }}
          animate={{ left: step >= 4 ? "60%" : "15%", opacity: step === 4 ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          ACK
        </motion.div>
      </div>
      <div className="mt-4 text-center text-muted-foreground font-medium">{getStatusText()}</div>
    </div>
  )
}
