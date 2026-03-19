import {
  AVAILABLE_LANGUAGES,
  AVAILABLE_PROFICIENCY_LEVELS,
  AVAILABLE_TOPICS,
  AVAILABLE_VOICES,
} from "@/lib/constants"
import { LiveAudioManager } from "@/services/liveAudioManager"
import { ConnectionState, TranscriptItem } from "@/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
type AudioStore = {
  connectionState: ConnectionState
  error: string | null
  liveAudioInstance: LiveAudioManager
  isMuted: boolean
  transcript: TranscriptItem[]
  agentState: "idle" | "listening" | "thinking" | "speaking"
  mediaStream: MediaStream | null


  selectedLanguage: string
  selectedProficiencyLevel: string
  selectedTopic: string
  selectedVoice: string

  setSelectedLanguage: (lang: string) => void
  setSelectedProficiencyLevel: (prof: string) => void
  setSelectedTopic: (topic: string) => void
  setSelectedVoice: (voice: string) => void
  setAgentState: (state: "idle" | "listening" | "thinking" | "speaking") => void


  connect: () => Promise<void>
  diconnect: () => Promise<void>
  toggleMute: () => void
}

export const useAudioStore = create<AudioStore>()(
  devtools((set, get) => ({
    connectionState: ConnectionState.DISCONNECTED,
    error: null,
    isMuted: false,
    transcript: [],
    agentState: "idle",
    mediaStream: null,

    selectedLanguage: AVAILABLE_LANGUAGES[0].code,
    selectedProficiencyLevel: AVAILABLE_PROFICIENCY_LEVELS[0].label,
    selectedTopic: AVAILABLE_TOPICS[0],
    selectedVoice: AVAILABLE_VOICES[0].name,

    setSelectedLanguage: (lang: string) => {
      set({ selectedLanguage: lang })
    },
    setSelectedProficiencyLevel: (prof: string) => {
      set({ selectedProficiencyLevel: prof })
    },
    setSelectedTopic: (topic: string) => {
      set({ selectedTopic: topic })
    },
    setSelectedVoice: (voice: string) => {
      set({ selectedVoice: voice })
    },
    setAgentState: (state) => {
      set({ agentState: state })
    },

    toggleMute: () => {
      const state = get()
      set({ isMuted: !state.isMuted })
      state.liveAudioInstance.setMute(!state.isMuted)
    },
    liveAudioInstance: null,
    connect: async () => {
      const state = get()

      const response = await fetch("/api/token")
      if (!response.ok) {
        set({ error: "failed to generate token" })

        return
      }

      const { token } = await response.json()

      if (
        state.connectionState === ConnectionState.CONNECTING ||
        state.connectionState === ConnectionState.CONNECTED
      ) {
        return
      }

      set({ error: null })

      //check microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      } catch {
        set({ error: "Microphone permission denied" })
      }

      let liveAudioManager = state.liveAudioInstance
      if (!liveAudioManager) {
        liveAudioManager = new LiveAudioManager(
          {
            onStateChange: (state) => set({ connectionState: state }),
            onError: (err) => set({ error: err }),
            onTranscript(sender, text, isPartial) {
              return set((state) => {
                const newTranscript = [...state.transcript]

                const existingIndex = newTranscript.findLastIndex((item) => {
                  return item.sender === sender && item.isPartial
                })

                if (existingIndex !== -1) {
                  newTranscript[existingIndex] = {
                    ...newTranscript[existingIndex],
                    text,
                    isPartial,
                  }
                  return { transcript: newTranscript }
                } else {
                  if (text) {
                    newTranscript.push({
                      id: crypto.randomUUID(),
                      sender,
                      text,
                      isPartial,
                    })
                    return { transcript: newTranscript }
                  }
                  return {}
                }
              })
            },

            onAudioLevel: () => {},
            onAgentStateChange: (state) => set({ agentState: state }),
          },
          token.name
        )

        set({ liveAudioInstance: liveAudioManager })
      }

      const selectedLang = AVAILABLE_LANGUAGES.find(
        (l) => l.code === state.selectedLanguage
      )
      // create session
      liveAudioManager.startSession({
        selected_assistant_voice: state.selectedVoice,
        selected_launguage_code: selectedLang?.code || "en-US",
        selected_launguage_name: selectedLang?.name || "English",
        selected_launguage_region: selectedLang?.region || "US",
        description: state.selectedTopic,
        selected_topic: state.selectedTopic,
        selected_proefficent_level: state.selectedProficiencyLevel,
      })

      setTimeout(() => {
        set({ mediaStream: liveAudioManager.getMediaStream() })
      }, 1000)
    },

    diconnect: async () => {
      const state = get()

      if (state.liveAudioInstance) {
        state.liveAudioInstance.diconnect()
        set({ liveAudioInstance: undefined, mediaStream: null, agentState: "idle" })
        set({ connectionState: ConnectionState.DISCONNECTED })
      }
    },
  }))
)
