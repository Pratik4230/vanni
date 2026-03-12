"use client";

import { Persona, type PersonaState } from "@/components/ai-elements/persona";

function VisualizationPanel() {
  const isConnected = true;
  // const isConnecting = false;
  const agentState = "talking";

  const personaState: PersonaState = !isConnected
    ? "idle"
    : agentState === "talking"
    ? "speaking"
    : agentState === "thinking"
    ? "thinking"
    : "listening";

  return (
    <div className="relative z-10 flex items-center justify-center w-full">
      <Persona
        variant="glint"
        state={personaState}
        className="size-48! sm:size-64!"
      />
    </div>
  );
}

export default VisualizationPanel;