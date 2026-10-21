// Web Speech API wrapper for Voice Recognition (Speech-to-Text) and Text-to-Speech (TTS)

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
};

// Text to speech for kids
export const speakToChild = (text: string, lang: string = 'id-ID') => {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // slightly slower for young learners
    utterance.pitch = 1.15; // slightly friendly higher tone

    // Try finding an Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
    if (indonesianVoice && lang.includes('id')) {
      utterance.voice = indonesianVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

export class VoiceRecognizer {
  private recognition: SpeechRecognitionInstance | null = null;
  public isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'id-ID';
      }
    }
  }

  startListening({
    lang = 'id-ID',
    onResult,
    onError,
    onEnd,
  }: {
    lang?: string;
    onResult: (transcript: string) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  }): boolean {
    if (!this.recognition) {
      if (onError) onError('Peramban web tidak mendukung fitur Speech Recognition');
      return false;
    }

    try {
      this.recognition.lang = lang;
      this.isListening = true;

      this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        onResult(transcript);
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Voice recognition start error:', err);
      this.isListening = false;
      if (onError) onError('Gagal mengakses mikrofon.');
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const voiceRecognizer = new VoiceRecognizer();

// Helper to normalize speech transcript and check if it matches keywords
export const matchVoiceAnswer = (transcript: string, acceptedKeywords: string[]): boolean => {
  if (!transcript || !acceptedKeywords || acceptedKeywords.length === 0) return false;

  // Clean transcript: lowercase, remove punctuation, normalize spaces
  const cleanTranscript = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  // Number word to digit mapping in Indonesian
  const numberMap: Record<string, string> = {
    nol: '0',
    satu: '1',
    dua: '2',
    tiga: '3',
    empat: '4',
    lima: '5',
    enam: '6',
    tujuh: '7',
    delapan: '8',
    sembilan: '9',
    sepuluh: '10',
    sebelas: '11',
    duabelas: '12',
    'dua belas': '12',
    tigabelas: '13',
    'tiga belas': '13',
    duapuluh: '20',
    'dua puluh': '20',
  };

  // Convert spoken number words to digits if matching
  let convertedTranscript = cleanTranscript;
  for (const [word, digit] of Object.entries(numberMap)) {
    if (convertedTranscript === word) {
      convertedTranscript = digit;
      break;
    }
  }

  for (const keyword of acceptedKeywords) {
    const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    if (cleanTranscript === cleanKeyword || convertedTranscript === cleanKeyword) {
      return true;
    }
    // Check if transcript includes keyword or keyword includes transcript
    if (cleanTranscript.includes(cleanKeyword) || cleanKeyword.includes(cleanTranscript)) {
      return true;
    }
    // Check letter-by-letter spelling match (e.g. "b u k u" or "b-u-k-u" matching "buku")
    const collapsedTranscript = cleanTranscript.replace(/\s+/g, '');
    const collapsedKeyword = cleanKeyword.replace(/\s+/g, '');
    if (collapsedTranscript === collapsedKeyword) {
      return true;
    }
  }

  return false;
};
