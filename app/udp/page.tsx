"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Network, Search, FileText, Play, BarChart3, Send } from "lucide-react"
import Link from "next/link"
import { UdpDatagramVisualization } from "@/components/udp/udp-datagram-visualization"

export default function UdpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">UDP Protocol</h1>
              <p className="text-muted-foreground">Interactive visualization of UDP Protocol</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">UDP Visualization</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore the UDP protocol through interactive visualizations and step-by-step examples.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <main className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>UDP Datagram</CardTitle>
            <CardDescription>Visualization of a UDP datagram being sent.</CardDescription>
          </CardHeader>
          <CardContent>
            <UdpDatagramVisualization />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
