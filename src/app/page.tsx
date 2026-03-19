import ControlsPanel from "@/components/ControlsPanel"
import LeftSidebar from "@/components/LeftSidebar"
import { Navbar } from "@/components/Navbar"
import RightSidebar from "@/components/RightSidebar"
import StatusPanel from "@/components/StatusPanel"
import VisualizationPanel from "@/components/VisualizationPanel"

const App = () => {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <Navbar />

      <div className="relative flex flex-1 overflow-hidden">
        <div className="hidden h-full w-72 flex-none flex-col border-r lg:flex xl:w-80">
          <LeftSidebar />
        </div>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Dot grid background */}
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(oklch(0.62 0.22 38) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Warm radial glow center */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.68 0.22 42 / 6%) 0%, transparent 70%)",
            }}
          />

          {/* Status */}
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex justify-center">
            <StatusPanel />
          </div>

          {/* Center Visualization */}
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <VisualizationPanel />
          </div>

          {/* Bottom Controls */}
          <div className="pointer-events-none absolute right-0 bottom-5 left-0 z-20 flex justify-center px-4 sm:bottom-8">
            <div className="pointer-events-auto w-full sm:w-auto">
              <ControlsPanel />
            </div>
          </div>
        </main>

        <div className="hidden h-full w-72 flex-none flex-col border-l lg:flex xl:w-80">
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}

export default App
