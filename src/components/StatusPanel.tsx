"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

function StatusPanel() {
  const isConnected = true;
  const isConnecting = false;
  const error = false;

  return (
    <div className="absolute top-4 sm:top-6 left-0 right-0 flex flex-col items-center gap-3 z-20 pointer-events-none px-4">
      {error && (
        <div className="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-4 py-2 rounded-full text-sm border border-red-200 dark:border-red-500/20 flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-4 pointer-events-auto">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div
        className={cn(
          "px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-500 flex items-center gap-2 backdrop-blur-sm shadow-sm",
          isConnecting
            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 animate-pulse"
            : isConnected
            ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
            : "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary dark:border-primary/25"
        )}
      >
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
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
  );
}

export default StatusPanel;