import React, { useMemo } from 'react';

interface ShatteredDialogueTextProps {
  text: string;
  isDissolving?: boolean;
  calmHue?: number;
  isFire?: boolean;
  fontSize?: number;
}

export const ShatteredDialogueText: React.FC<ShatteredDialogueTextProps> = ({
  text,
  isDissolving = false,
  fontSize
}) => {
  if (!text) return null;

  // Split text by lines while preserving structure
  const lines = useMemo(() => {
    return text.split('\n');
  }, [text]);

  // Compute words and global character indices for smooth staggered letter appearance without word breaking
  const structuredLines = useMemo(() => {
    let globalCharIndex = 0;

    return lines.map((lineText) => {
      const words = lineText.split(/\s+/).filter(Boolean);
      const structuredWords = words.map((word) => {
        const chars = Array.from(word);
        const startIndex = globalCharIndex;
        globalCharIndex += chars.length;
        return {
          word,
          chars,
          startIndex,
        };
      });

      return {
        lineText,
        words: structuredWords,
      };
    });
  }, [lines]);

  return (
    <div
      className={`w-full max-w-sm sm:max-w-md mx-auto min-h-[48px] flex flex-col items-center justify-center text-center px-1 py-0.5 transition-all duration-500 ease-out select-none ${
        isDissolving ? 'animate-dissolve-vapor opacity-0 filter blur-md scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div 
        className="relative z-10 flex flex-wrap items-center justify-center not-italic font-normal tracking-tight text-center leading-snug px-1 py-0.5 w-full"
        style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}
      >
        {structuredLines.map((lineObj, lineIdx) => (
          <React.Fragment key={lineIdx}>
            {lineIdx > 0 && <span className="w-full h-1.5 block" aria-hidden="true" />}
            {lineObj.words.map((wObj, wIdx) => (
              <span
                key={`${lineIdx}-${wIdx}-${wObj.word}`}
                className="inline-flex items-baseline mr-[0.34em] last:mr-0 align-baseline whitespace-nowrap"
              >
                {wObj.chars.map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="inline-block transition-all text-[#FFFDD0] drop-shadow-[0_0_8px_rgba(255,253,208,0.45)]"
                    style={{
                      animation: 'blurSeepIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      animationDelay: `${(wObj.startIndex + cIdx) * 18}ms`,
                      opacity: 0,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
