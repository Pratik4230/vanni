export const MODEL = "gemini-2.5-flash-native-audio-preview-09-2025"
export const INPUT_SAMPLE_RATE = 16000
export const OUTPUT_SAMPLE_RATE = 24000

export const AVAILABLE_TOPICS = [
  "Full Stack Development",
  "Frontend Engineering",
  "Backend Engineering",
  "System Design",
  "Behavioral (HR)",
  "Data Structures & Algorithms",
]

// BCP 47 Standard: Language-Region
export const AVAILABLE_LANGUAGES = [
  { id: "en-IN", name: "English", region: "India", code: "en-IN" },
  { id: "en-US", name: "English", region: "United States", code: "en-US" },
  { id: "en-GB", name: "English", region: "United Kingdom", code: "en-GB" },
  { id: "hi-IN", name: "Hindi", region: "India", code: "hi-IN" },
  { id: "mr-IN", name: "Marathi", region: "India", code: "mr-IN" },
  { id: "kn-IN", name: "Kannada", region: "India", code: "kn-IN" },
  { id: "pa-IN", name: "Punjabi", region: "India", code: "pa-IN" },
  { id: "bn-IN", name: "Bengali", region: "India", code: "bn-IN" },
  { id: "gu-IN", name: "Gujarati", region: "India", code: "gu-IN" },
  { id: "ta-IN", name: "Tamil", region: "India", code: "ta-IN" },
  { id: "te-IN", name: "Telugu", region: "India", code: "te-IN" },
  { id: "ml-IN", name: "Malayalam", region: "India", code: "ml-IN" },
  { id: "or-IN", name: "Odia", region: "India", code: "or-IN" },
  { id: "as-IN", name: "Assamese", region: "India", code: "as-IN" },
  { id: "ur-IN", name: "Urdu", region: "India", code: "ur-IN" },
]

export const AVAILABLE_VOICES = [
  { id: "aoede", name: "Aoede", category: "Female HR (Warm & Welcoming)" },
  { id: "kore", name: "Kore", category: "Female HR (Firm & Direct)" },
  { id: "puck", name: "Puck", category: "Male HR (Friendly & Upbeat)" },
  {
    id: "charon",
    name: "Charon",
    category: "Male HR (Senior & Authoritative)",
  },
  { id: "fenrir", name: "Fenrir", category: "Male HR (Energetic)" },
]

export const AVAILABLE_PROFICIENCY_LEVELS = [
  {
    id: "fresher",
    label: "Fresher / Junior",
    description: "0-2 years of experience",
  },
  {
    id: "midlevel",
    label: "Mid-Level",
    description: "2-5 years of experience",
  },
  {
    id: "senior",
    label: "Senior",
    description: "5+ years of experience",
  },
]
