"use client"

import { cn } from "@/lib/utils"
import { useAudioStore } from "@/store/useAudioStore"
import { ConnectionState } from "@/types"
import { AlertCircle } from "lucide-react"

function StatusPanel() {
  const { connectionState, error } = useAudioStore()
  const isConnected = connectionState === ConnectionState.CONNECTED
  const isConnecting = connectionState === ConnectionState.CONNECTING

  return (
    <div className="pointer-events-none absolute top-4 right-0 left-0 z-20 flex flex-col items-center gap-3 px-4 sm:top-6">
      {error && (
        <div className="pointer-events-auto flex animate-in items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 shadow-lg fade-in slide-in-from-top-4 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm transition-all duration-500 sm:px-4",
          isConnecting
            ? "animate-pulse border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
            : isConnected
              ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "border-primary/20 bg-primary/5 text-primary dark:border-primary/25 dark:bg-primary/10 dark:text-primary"
        )}
      >
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isConnecting
              ? "bg-blue-500"
              : isConnected
                ? "bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]"
                : "bg-primary"
          )}
        />
        {isConnecting
          ? "Connecting..."
          : isConnected
            ? "Live Session"
            : "Ready to Talk"}
      </div>
    </div>
  )
}

export default StatusPanel
