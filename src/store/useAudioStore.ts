import { LiveAudioManager } from "@/services/liveAudioManager";
import { ConnectionState, TranscriptItem } from "@/types";
import {create} from "zustand";
import { devtools } from "zustand/middleware";

type AudioStore = {
    connectionState: ConnectionState;
    error: string | null;
    liveAudioInstance: LiveAudioManager;
    isMuted: boolean
    transcript: TranscriptItem[]
    connect: () => Promise<void>
     diconnect: () => Promise<void>
    toggleMute: () => void

};

export const useAudioStore = create<AudioStore>()(
    devtools((set, get) => ({

connectionState: ConnectionState.DISCONNECTED,        
error: null,
isMuted: false,
transcript: [],
toggleMute: () => {
const state = get();
set({isMuted: !state.isMuted});
state.liveAudioInstance.setMute(!state.isMuted);
},
liveAudioInstance: null,
     connect: async () => {

        const state =  get();

        if (state.connectionState === ConnectionState.CONNECTING || state.connectionState === ConnectionState.CONNECTED) {
            return;
        }

        set({error: null});

        //check microphone permission
        try {
            await navigator.mediaDevices.getUserMedia({
                audio: true
            })
        } catch  {
         set({error: "Microphone permission denied"})   
        }

       
        let liveAudioManager = state.liveAudioInstance
        if (!liveAudioManager) {
            //@ts-ignore
           liveAudioManager =   new LiveAudioManager({
            onStateChange: (state) => set({connectionState: state}),
            onError: (err) => set({error: err}),
            onTranscript(sender, text, isPartial) {
                return set((state) => {
                    const newTranscript = [...state.transcript]

                const existingIndex = newTranscript.findLastIndex((item) => {
                    return (
                        item.sender === sender && item.isPartial
                    );
                });

                if (existingIndex !== -1) {
                    newTranscript[existingIndex]  = {
                        ...newTranscript[existingIndex],
                        text, isPartial
                    }
                    return {transcript: newTranscript}
                } else {
                   if (text) {
                     newTranscript.push({
                        id: crypto.randomUUID(),
                        sender,
                        text,
                        isPartial
                    });
                     return {transcript: newTranscript}
                   }
                }
                })
            },
           });


           set({liveAudioInstance: liveAudioManager})
        }
      
        liveAudioManager.startSession()
     },

     diconnect: async () => {
const state = get();

if (state.liveAudioInstance) {
    state.liveAudioInstance.diconnect();
    set({liveAudioInstance: undefined})
    set({connectionState: ConnectionState.DISCONNECTED})
}
     }
    
    }))
)