"use client"

import { useState } from "react"
import { Loader2, Mic, MicOff, PhoneOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector"
import { useAudioStore } from "@/store/useAudioStore"
import { ConnectionState } from "@/types"

function ControlsPanel() {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(
    undefined
  )
  const { connect, connectionState, toggleMute, isMuted, diconnect } =
    useAudioStore()
  const isConnected = connectionState === ConnectionState.CONNECTED
  const isConnecting = connectionState === ConnectionState.CONNECTING

  return (
    <div className="mx-auto w-full max-w-[92vw] sm:max-w-fit">
      <div
        className={cn(
          "flex items-center justify-between gap-2 p-2.5 sm:justify-center sm:gap-3 sm:p-2",
          "rounded-2xl sm:rounded-full",
          "border border-border/60",
          "bg-background/80 backdrop-blur-xl",
          "shadow-lg shadow-black/10 dark:shadow-black/40",
          "transition-all duration-300"
        )}
      >
        <div className="min-w-0 flex-1 sm:flex-none">
          <MicSelector value={selectedDevice} onValueChange={setSelectedDevice}>
            <MicSelectorTrigger
              className="h-10 w-full gap-2 text-sm sm:w-48"
              disabled={isConnecting}
            >
              <Mic className="h-4 w-4 shrink-0 text-muted-foreground" />
              <MicSelectorValue />
            </MicSelectorTrigger>
            <MicSelectorContent>
              <MicSelectorInput />
              <MicSelectorList>
                {(devices) =>
                  devices.length === 0 ? (
                    <MicSelectorEmpty />
                  ) : (
                    devices.map((device) => (
                      <MicSelectorItem
                        key={device.deviceId}
                        value={device.deviceId}
                      >
                        <MicSelectorLabel device={device} />
                      </MicSelectorItem>
                    ))
                  )
                }
              </MicSelectorList>
            </MicSelectorContent>
          </MicSelector>
        </div>

        <div className="mx-1 hidden h-7 w-px bg-border sm:block" />

        <div className="flex shrink-0 items-center gap-2">
          {isConnected && (
            <Button
              onClick={toggleMute}
              variant="secondary"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full transition-all duration-200",
                isMuted
                  ? "border-red-200 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-500"
                  : "bg-transparent hover:bg-primary/10 hover:text-primary"
              )}
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}

          {!isConnected && !isConnecting ? (
            <Button
              onClick={() => connect()}
              size="lg"
              className={cn(
                "rounded-xl sm:rounded-full",
                "h-11 px-5 sm:px-6",
                "border-0 font-semibold text-white",
                "shadow-md hover:opacity-90 hover:shadow-lg",
                "transition-all duration-200 active:scale-95"
              )}
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 20px rgb(249 115 22 / 30%)",
              }}
            >
              <Mic className="mr-2 h-4 w-4" />
              <span>Connect</span>
            </Button>
          ) : (
            <Button
              onClick={diconnect}
              disabled={isConnecting}
              variant="destructive"
              size="lg"
              className={cn(
                "rounded-xl sm:rounded-full",
                "h-11 px-5 sm:px-6",
                "font-semibold",
                "transition-all duration-200 active:scale-95"
              )}
            >
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PhoneOff className="mr-2 h-4 w-4" />
              )}
              <span>{isConnecting ? "Connecting..." : "End"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ControlsPanel
