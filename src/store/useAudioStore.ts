import { LiveAudioManager } from "@/services/liveAudioManager";
import { ConnectionState } from "@/types";
import {create} from "zustand";
import { devtools } from "zustand/middleware";

type AudioStore = {
    connectionState: ConnectionState;
    error: string | null;
    liveAudioInstance: LiveAudioManager
    connect: () => Promise<void>
};

export const useAudioStore = create<AudioStore>()(
    devtools((set, get) => ({

connectionState: ConnectionState.DISCONNECTED,        
error: null,
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
           liveAudioManager =    new LiveAudioManager();
           set({liveAudioInstance: liveAudioManager})
        }
      
        liveAudioManager.startSession()
     }
    
    }))
)