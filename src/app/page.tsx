
import ControlsPanel from "@/components/ControlsPanel";
import LeftSidebar from "@/components/LeftSidebar";
import { Navbar } from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import StatusPanel from "@/components/StatusPanel";
import VisualizationPanel from "@/components/VisualizationPanel";

const App = () => {
  return (
    <div className="h-dvh w-full flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        <div className="hidden lg:flex flex-col h-full flex-none w-72 xl:w-80 border-r">
          <LeftSidebar />
        </div>

        <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
          {/* Dot grid background */}
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(oklch(0.62 0.22 38) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Warm radial glow center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.68 0.22 42 / 6%) 0%, transparent 70%)",
            }}
          />

          {/* Status */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pointer-events-none">
            <StatusPanel />
          </div>

          {/* Center Visualization */}
          <div className="flex-1 w-full h-full flex items-center justify-center">
            <VisualizationPanel />
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-5 sm:bottom-8 left-0 right-0 flex justify-center z-20 px-4 pointer-events-none">
            <div className="pointer-events-auto w-full sm:w-auto">
              <ControlsPanel />
            </div>
          </div>
        </main>

        <div className="hidden lg:flex flex-col h-full flex-none w-72 xl:w-80 border-l">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default App;