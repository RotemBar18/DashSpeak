
import { GoogleGenAI, Modality } from "@google/genai";

// Standard base64 decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert Raw PCM 16-bit to AudioBuffer
// Optimized for throughput
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Create a view directly on the buffer to avoid copying if possible
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  // Pre-calculate inverse max value for multiplication (slightly faster than division)
  const scalar = 1.0 / 32768.0;

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    let i = 0;
    // Unrolled loop for slightly better performance on large chunks
    for (; i < frameCount - 3; i += 4) {
       channelData[i] = dataInt16[i * numChannels + channel] * scalar;
       channelData[i+1] = dataInt16[(i+1) * numChannels + channel] * scalar;
       channelData[i+2] = dataInt16[(i+2) * numChannels + channel] * scalar;
       channelData[i+3] = dataInt16[(i+3) * numChannels + channel] * scalar;
    }
    // Handle remaining
    for (; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] * scalar;
    }
  }
  return buffer;
}

// Global state for audio management
let audioContext: AudioContext | null = null;
let scheduledSources: AudioBufferSourceNode[] = [];
let nextStartTime = 0;
let isStopped = false;

// Initialize GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

export function stopSpeaking() {
  isStopped = true;
  scheduledSources.forEach(source => {
    try { source.stop(); } catch (e) { /* ignore */ }
  });
  scheduledSources = [];
  nextStartTime = 0;
}

/**
 * Streams text to speech.
 * @param text The text to speak
 * @param onEnded Callback when playback finishes
 * @param onStart Callback when the first chunk of audio is received and scheduled (UI feels faster)
 */
export async function speakText(text: string, onEnded?: () => void, onStart?: () => void) {
  try {
    // 1. Reset state
    stopSpeaking();
    isStopped = false;
    
    const ctx = initAudioContext();

    // CRITICAL FIX: Explicitly await resume. 
    // If the context is suspended (common browser policy), the clock won't tick, 
    // causing a massive delay (2+ mins) or silence until a user interaction wakes it up.
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn("Could not resume audio context immediately", e);
      }
    }

    // Initialize timing cursor slightly in the future to allow buffer processing time
    nextStartTime = ctx.currentTime + 0.05; 

    // 2. Request Streaming Audio
    const streamResult = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    let hasStarted = false;

    // 3. Process Stream Chunks
    for await (const chunk of streamResult) {
      if (isStopped) break;

      const base64Audio = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) continue;

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        ctx,
        24000,
        1,
      );
      
      if (isStopped) break;

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      // Schedule gapless playback
      const startAt = Math.max(ctx.currentTime, nextStartTime);
      source.start(startAt);
      
      // Advance cursor to the end of this buffer
      nextStartTime = startAt + audioBuffer.duration;
      scheduledSources.push(source);
      
      // Notify UI that audio is effectively playing now
      if (!hasStarted) {
        hasStarted = true;
        if (onStart) onStart();
      }
    }

    // 4. Handle Completion
    // We attach onEnded to the last scheduled chunk to know when *playback* finishes
    if (scheduledSources.length > 0) {
        const lastSource = scheduledSources[scheduledSources.length - 1];
        lastSource.addEventListener('ended', () => {
             if (!isStopped && onEnded) {
                 onEnded(); 
             }
        });
    } else {
        if (onEnded) onEnded();
    }

  } catch (error) {
    console.error("TTS Error:", error);
    if (onEnded) onEnded();
  }
}
