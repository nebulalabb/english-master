'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Info, Check, X, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardProps {
  word: string;
  phonetic?: string;
  definition: string;
  examples?: string[];
  imageUrl?: string;
  onAnswer?: (quality: number) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, phonetic, definition, examples, imageUrl, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (quality: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnswer) onAnswer(quality);
    setIsFlipped(false);
  };

  return (
    <div className="perspective-1000 w-full max-w-md h-[500px] cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full duration-500 preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-card border-4 border-primary/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Volume2 className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
          </div>
          
          <div className="space-y-4">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/50">Phát âm</span>
             <h2 className="text-6xl font-black tracking-tighter">{word}</h2>
             {phonetic && <p className="text-xl text-muted-foreground font-medium italic">{phonetic}</p>}
          </div>

          <div className="mt-24 text-sm text-muted-foreground animate-bounce font-medium opacity-50 italic">
            Chạm để lật thẻ
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted/20">
             <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: isFlipped ? '100%' : '50%' }} />
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl shadow-2xl flex flex-col p-8 text-center rotate-y-180">
          <div className="mt-8 space-y-6 flex-1">
             <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Ý nghĩa</span>
                <h3 className="text-3xl font-bold">{definition}</h3>
             </div>

             {examples && examples.length > 0 && (
               <div className="space-y-2 text-left bg-white/10 p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Ví dụ</span>
                  <p className="text-lg italic leading-relaxed">"{examples[0]}"</p>
               </div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
             <Button 
                variant="secondary" 
                className="h-16 rounded-2xl flex flex-col gap-1 items-center justify-center bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={(e) => handleAnswer(1, e)}
              >
                <X className="h-6 w-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Chưa thuộc</span>
             </Button>
             <Button 
                variant="secondary" 
                className="h-16 rounded-2xl flex flex-col gap-1 items-center justify-center bg-white text-primary hover:bg-white/90"
                onClick={(e) => handleAnswer(5, e)}
              >
                <Check className="h-6 w-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Đã thuộc</span>
             </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Styles for 3D flip if not globally available */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Flashcard;
