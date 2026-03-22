'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Flashcard from './Flashcard';
import axios from '@/lib/axios';

interface ReviewSessionProps {
  words: any[];
  onComplete: () => void;
  onClose: () => void;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ words, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{ wordId: string; quality: number }[]>([]);

  const currentWord = words[currentIndex];

  const handleAnswer = async (quality: number) => {
    try {
      // Send result to backend
      await axios.post(`/vocabulary/review/${currentWord.wordId || currentWord.word.id}`, { quality });
      
      setResults([...results, { wordId: currentWord.wordId || currentWord.word.id, quality }]);

      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (completed) {
    const perfectCount = results.filter(r => r.quality >= 4).length;
    
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <Trophy className="h-32 w-32 text-primary relative z-10" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="h-12 w-12 text-yellow-500" />
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-5xl font-black tracking-tight">Tuyệt vời!</h2>
          <p className="text-xl text-muted-foreground italic">Bạn đã hoàn thành phiên ôn tập hôm nay.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 w-full max-w-md">
           <div className="bg-card p-6 rounded-3xl border shadow-sm">
              <div className="text-4xl font-black text-primary">{words.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-2">Từ đã ôn</div>
           </div>
           <div className="bg-card p-6 rounded-3xl border shadow-sm">
              <div className="text-4xl font-black text-green-500">{perfectCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-2">Ghi nhớ tốt</div>
           </div>
        </div>

        <Button size="lg" className="h-16 px-12 text-xl font-black rounded-full shadow-2xl shadow-primary/30" onClick={onComplete}>
          Quay lại Bảng điều khiển
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1 max-w-md mx-8">
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
               className="h-full bg-primary"
               initial={{ width: 0 }}
               animate={{ width: `${((currentIndex) / words.length) * 100}%` }}
               transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          </div>
          <div className="text-[10px] uppercase font-bold text-center mt-2 tracking-widest text-muted-foreground">
            Tiến độ: {currentIndex + 1} / {words.length}
          </div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center font-black text-primary bg-primary/10 rounded-full">
           {currentIndex + 1}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full max-w-md"
          >
            <Flashcard 
              word={currentWord.word.word}
              phonetic={currentWord.word.phonetic}
              definition={currentWord.word.definition}
              examples={currentWord.word.examplesJson as string[]}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewSession;
