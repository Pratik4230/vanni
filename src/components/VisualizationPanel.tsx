"use client"

import { Orb } from "@/components/ui/orb"
import { useAudioStore } from "@/store/useAudioStore"
import { ConnectionState } from "@/types"

function VisualizationPanel() {
  const { connectionState, agentState } = useAudioStore()
  
  const isConnected = connectionState === ConnectionState.CONNECTED

  const orbState = !isConnected
    ? null
    : agentState === "speaking"
      ? "talking"
      : agentState === "thinking"
        ? "thinking"
        : "listening"

  return (
    <div className="relative z-10 flex w-full items-center justify-center">
      <Orb
        agentState={orbState}
        className="size-48! sm:size-72!"
        colors={["#f97316", "#fb923c"]} // Matching the brand's potential orange theme, or maybe keep default? Let's use clean defaults or let Orb use its own default
      />
    </div>
  )
}

export default VisualizationPanel
