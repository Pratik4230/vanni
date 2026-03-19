import {
  base64ToUnit8Array,
  createPCMBlob,
  decodeAudioData,
} from "@/lib/audioUtils"
import { INPUT_SAMPLE_RATE, MODEL, OUTPUT_SAMPLE_RATE } from "@/lib/constants"
import { ConnectConfig, ConnectionState, LiveManagerCallbacks } from "@/types"
import {
  GoogleGenAI,
  LiveConnectConfig,
  LiveServerMessage,
  Modality,
  Session,
} from "@google/genai"

export class LiveAudioManager {
  private ai: GoogleGenAI
  private activeSession: Session | null = null
  private inputAudioContext: AudioContext | null = null
  private outputAudioContext: AudioContext | null = null
  private outputNode: GainNode | null = null
  private mediaStream: MediaStream | null = null
  private workletNode: AudioWorkletNode | null = null
  private inputSource: MediaStreamAudioSourceNode | null = null
  private nextStartTime = 0
  private sources = new Set<AudioBufferSourceNode>()
  private callbacks: LiveManagerCallbacks
  private isMuted: boolean = false

  private inputTranscription = ""
  private outputTranscription = ""

  constructor(callbacks: LiveManagerCallbacks, token: string) {
    this.ai = new GoogleGenAI({
      apiKey: token,
      apiVersion: "v1alpha",
    })

    this.callbacks = callbacks
  }

  async startSession(connectConfig: ConnectConfig) {
    try {
      console.log("Starting Session")

      this.callbacks.onStateChange(ConnectionState.CONNECTING)

      const config: LiveConnectConfig = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: connectConfig.selected_assistant_voice,
            },
          },
        },
        systemInstruction: this.generateSystemPrompt(connectConfig),
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      }

      this.activeSession = await this.ai.live.connect({
        model: MODEL,
        config: config,
        callbacks: {
          onopen: () => {
            this.callbacks.onStateChange(ConnectionState.CONNECTED)
            this.callbacks.onAgentStateChange?.("listening")
          },

          onmessage: this.handleMessage.bind(this),

          onerror: () => {
            this.callbacks.onStateChange(ConnectionState.ERROR)
            this.callbacks.onError("Could not connect")
          },
          onclose: (e) => console.log("Close  Gemini ", e.reason),
        },
      })

      this.inputAudioContext = new AudioContext({
        sampleRate: INPUT_SAMPLE_RATE,
      })
      this.outputAudioContext = new AudioContext({
        sampleRate: OUTPUT_SAMPLE_RATE,
      })

      if (this.inputAudioContext.state === "suspended") {
        this.inputAudioContext.resume()
      }

      if (this.outputAudioContext.state === "suspended") {
        this.outputAudioContext.resume()
      }

      this.outputNode = this.outputAudioContext.createGain()
      this.outputNode.connect(this.outputAudioContext.destination)

      await this.inputAudioContext.audioWorklet.addModule(
        "/worklets/mic-processor.js"
      )

      this.workletNode = new AudioWorkletNode(
        this.inputAudioContext,
        "mic-processor"
      )

      this.workletNode.port.onmessage = (event) => {
        const pcmBlob = createPCMBlob(event.data as Float32Array)

        this.activeSession?.sendRealtimeInput({
          audio: pcmBlob,
        })
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: INPUT_SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      this.inputSource = this.inputAudioContext.createMediaStreamSource(
        this.mediaStream
      )

      this.inputSource.connect(this.workletNode)
    } catch (e) {
      console.error("Error : ", e)
      this.callbacks.onStateChange(ConnectionState.ERROR)
      this.callbacks.onError("Something went wrong")
    }
  }

  generateSystemPrompt(config: ConnectConfig) {
    return `
    ROLE: You are an expert Technical Interviewer and HR Manager. Your name is "Vanni".

    GOAL: Conduct a realistic mock interview to evaluate the candidate's skills.
    COMMUNICATION LANGUAGE: ${config.selected_launguage_name} (${config.selected_launguage_region}).
    INTERVIEW ROLE / TOPIC: ${config.selected_topic}.
    CANDIDATE EXPERIENCE LEVEL: ${config.selected_proefficent_level}.

    INSTRUCTIONS:
    1.  **Strictly** speak in ${config.selected_launguage_name}.
    2.  **Interview Flow**:
        - Start by greeting the candidate and asking a brief introductory question.
        - Ask relevant technical, situational, or behavioral questions based on the candidate's experience level (${config.selected_proefficent_level}) and role (${config.selected_topic}).
        - Keep your questions concise. Wait for the candidate's answer before proceeding.
        - Ask follow-up questions to probe their understanding if their answer is shallow.
    3.  **Feedback**:
        - Do not correct them immediately after every mistake unless they are completely stuck. Let them finish answering, then politely nod or acknowledge their point before asking the next question.
    `
  }

  async handleMessage(message: LiveServerMessage) {
    const serverContent = message.serverContent

    if (serverContent?.interrupted) {
      this.stopAllAudio()
      this.callbacks.onAgentStateChange?.("listening")
    }

    if (serverContent?.inputTranscription?.text) {
      this.inputTranscription += serverContent?.inputTranscription?.text
      this.callbacks.onTranscript("user", this.inputTranscription, true)
    }

    if (serverContent?.outputTranscription?.text) {
      this.outputTranscription += serverContent?.outputTranscription?.text
      this.callbacks.onTranscript("model", this.outputTranscription, true)
    }

    if (serverContent?.turnComplete) {
      if (this.inputTranscription) {
        this.callbacks.onTranscript("user", this.inputTranscription, false)
        this.inputTranscription = ""
      }

      if (this.outputTranscription) {
        this.callbacks.onTranscript("model", this.outputTranscription, false)
        this.outputTranscription = ""
        this.callbacks.onAgentStateChange?.("listening")
      }
    }

    const base64Data = serverContent?.modelTurn?.parts?.[0].inlineData?.data

    if (!base64Data) return
    this.callbacks.onAgentStateChange?.("speaking")
    await this.playAudioChunk(base64Data as string)

    //   serverContent.inputTranscription()
  }

  async playAudioChunk(audioData: string) {
    const uintData = base64ToUnit8Array(audioData)

    if (!this.outputAudioContext || !this.outputNode) return

    const audioBuffer = await decodeAudioData(
      uintData,
      this.outputAudioContext,
      OUTPUT_SAMPLE_RATE,
      1
    )

    if (this.nextStartTime < this.outputAudioContext.currentTime) {
      this.nextStartTime = this.outputAudioContext.currentTime
    }

    const source = this.outputAudioContext?.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.outputNode)
    // source.connect(this.outputAudioContext.destination)

    source.start(this.nextStartTime)
    this.nextStartTime += audioBuffer.duration

    source.addEventListener("ended", () => {
      this.sources.delete(source)
    })

    this.sources.add(source)
  }

  async stopAllAudio() {
    this.sources.forEach((source) => {
      try {
        source.stop()
      } catch {}
    })

    this.sources.clear()

    if (this.outputAudioContext) {
      this.nextStartTime = this.outputAudioContext?.currentTime
    }
  }

  setMute(isMuted: boolean) {
    this.isMuted = isMuted

    if (this.mediaStream) {
      this.mediaStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !isMuted))
    }
  }

  diconnect() {
    this.stopAllAudio()
    if (this.activeSession) {
      this.activeSession.close()
      this.activeSession = null
    }

    this.inputSource?.disconnect()
    this.workletNode?.disconnect()
    this.outputAudioContext?.close()
    this.inputAudioContext?.close()
    this.outputNode?.disconnect()

    this.callbacks.onStateChange(ConnectionState.DISCONNECTED)
  }
}
