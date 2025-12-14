import { useState, useEffect, useRef } from 'react';

interface UseTypingEffectOptions {
  speed?: number; // milliseconds per character
  enabled?: boolean;
}

/**
 * Hook that creates a typing effect by revealing text character by character
 */
export function useTypingEffect(
  text: string,
  options: UseTypingEffectOptions = {}
): string {
  const { speed = 20, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(text);
  const isCompleteRef = useRef(false);

  // Reset when text changes
  useEffect(() => {
    if (textRef.current !== text) {
      textRef.current = text;
      setCurrentIndex(0);
      setDisplayedText('');
      isCompleteRef.current = false;
    }
  }, [text]);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      isCompleteRef.current = true;
      return;
    }

    if (currentIndex < text.length && !isCompleteRef.current) {
      const timeout = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setDisplayedText(text.slice(0, nextIndex));
        setCurrentIndex(nextIndex);
        
        if (nextIndex >= text.length) {
          isCompleteRef.current = true;
        }
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, speed, enabled]);

  return displayedText;
}

