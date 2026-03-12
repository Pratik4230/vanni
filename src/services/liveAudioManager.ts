import { MODEL } from '@/lib/constants';
import { GoogleGenAI, Modality, Session } from '@google/genai';


export class LiveAudioManager {

    private ai: GoogleGenAI;
    private activeSession: Session | null = null

    constructor() {
        this.ai = new GoogleGenAI({
apiKey:"AIzaSyBY7AZ8lZ9bO89pihnZcxqrdGtnoU9FoBs"
        })
    }

    async startSession(){
    console.log("Starting Session")

   const config = { responseModalities: [Modality.AUDIO],
     systemInstruction: "You are a helpful and friendly AI assistant."
    };

    this.activeSession = await this.ai.live.connect({
        model: MODEL ,
        config: config,
        callbacks: {
            onopen: () => console.log("Connected to Gemini "),
            onmessage: (message) => console.log("message Gemini ", message),
            onerror: (e) => console.log("Error Gemini ", e.message),
            onclose: (e) => console.log("Close  Gemini ", e.reason),
        }
    })
    }
}



