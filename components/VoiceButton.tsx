
import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopSpeaking } from '../services/ttsService';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { COLORS } from '../colors';

interface VoiceButtonProps {
  text: string;
  autoPlay?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ text, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      handleToggle();
    }
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleToggle = async () => {
    if (isPlaying || isLoading) {
      stopSpeaking();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      
      // We don't await speakText here directly because we want to rely on the callbacks
      // to manage the state. speakText resolves when streaming finishes, not when playback finishes.
      speakText(
        text, 
        // onEnded: Called when audio physically stops playing
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        // onStart: Called when the first chunk is buffered and scheduled (Fast UI response)
        () => {
          setIsLoading(false);
          setIsPlaying(true);
        }
      ).catch((error) => {
        console.error("Failed to play audio", error);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  };

  const getStyle = () => {
    if (isLoading) {
      return {
        backgroundColor: COLORS.card.highlight,
        borderColor: COLORS.icon.secondary,
        color: COLORS.icon.secondary
      };
    }
    if (isPlaying) {
      return {
        backgroundColor: COLORS.button.disabledBg, // Using sky/disabled color for active state
        borderColor: COLORS.button.primaryBg,
        color: COLORS.text.primary
      };
    }
    return {
      backgroundColor: COLORS.card.highlight,
      borderColor: "transparent",
      color: COLORS.text.primary
    };
  };

  const style = getStyle();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm border-2"
      style={style}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isPlaying ? (
        <Square className="w-5 h-5 fill-current" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
      
      <span className="text-sm font-extrabold min-w-[3.5rem] text-center">
        {isLoading ? 'Wait...' : isPlaying ? 'Stop' : 'Hear'}
      </span>
    </button>
  );
};

export default VoiceButton;
