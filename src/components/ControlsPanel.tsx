"use client";

import { useState } from "react";
import { Loader2, Mic, MicOff, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "@/components/ai-elements/mic-selector";
import { useAudioStore } from "@/store/useAudioStore";
import { ConnectionState } from "@/types";

function ControlsPanel() {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
  const { connect, connectionState, toggleMute, isMuted } = useAudioStore();
  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING


  return (
    <div className="w-full max-w-[92vw] sm:max-w-fit mx-auto">
      <div
        className={cn(
          "flex items-center justify-between sm:justify-center gap-2 sm:gap-3 p-2.5 sm:p-2",
          "rounded-2xl sm:rounded-full",
          "border border-border/60",
          "bg-background/80 backdrop-blur-xl",
          "shadow-lg shadow-black/10 dark:shadow-black/40",
          "transition-all duration-300"
        )}
      >
        <div className="flex-1 sm:flex-none min-w-0">
          <MicSelector
            value={selectedDevice}
            onValueChange={setSelectedDevice}
          >
            <MicSelectorTrigger
              className="h-10 w-full sm:w-48 gap-2 text-sm"
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

        <div className="hidden sm:block w-px h-7 bg-border mx-1" />

        <div className="flex items-center gap-2 shrink-0">
          {isConnected && (
            <Button
              onClick={toggleMute}
              variant="secondary"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full transition-all duration-200",
                isMuted
                  ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-500"
                  : "bg-transparent hover:bg-primary/10 hover:text-primary"
              )}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}

          {!isConnected && !isConnecting ? (
            <Button
              onClick={() => connect()}
              size="lg"
              className={cn(
                "rounded-xl sm:rounded-full",
                "h-11 px-5 sm:px-6",
                "text-white font-semibold border-0",
                "shadow-md hover:opacity-90 hover:shadow-lg",
                "transition-all duration-200 active:scale-95"
              )}
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 20px rgb(249 115 22 / 30%)",
              }}
            >
              <Mic className="h-4 w-4 mr-2" />
              <span>Connect</span>
            </Button>
          ) : (
            <Button
              onClick={() => {}}
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
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <PhoneOff className="h-4 w-4 mr-2" />
              )}
              <span>{isConnecting ? "Connecting..." : "End"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlsPanel;