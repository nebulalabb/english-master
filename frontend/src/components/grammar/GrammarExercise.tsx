'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from '@/lib/axios';

interface GrammarExerciseProps {
  exercises: any[];
}

const GrammarExerciseComponent: React.FC<GrammarExerciseProps> = ({ exercises }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentEx = exercises[currentIndex];

  const handleCheck = async () => {
    if (!userInput && !selectedOption) return;
    
    try {
      setIsChecking(true);
      const answer = currentEx.type === 'MULTIPLE_CHOICE' ? selectedOption : userInput;
      const response = await axios.post(`/grammar/exercises/${currentEx.id}/answer`, { answer });
      
      setFeedback(response.data);
      if (response.data.isCorrect) {
        setScore(score + 1);
      }
      setShowExplanation(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setSelectedOption(null);
      setFeedback(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="text-center py-20 space-y-8 bg-card/50 rounded-3xl border border-primary/20 backdrop-blur-sm">
         <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="flex justify-center"
         >
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center relative">
               <Sparkles className="h-16 w-16 text-primary" />
               <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
               />
            </div>
         </motion.div>
         <div className="space-y-2">
            <h2 className="text-4xl font-black italic">Chúc mừng!</h2>
            <p className="text-muted-foreground text-lg">Bạn đã hoàn thành phần luyện tập ngữ pháp.</p>
         </div>
         <div className="flex justify-center gap-8 py-4">
            <div>
               <div className="text-5xl font-black text-primary">{score} / {exercises.length}</div>
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-2">Điểm số</div>
            </div>
         </div>
         <Button size="lg" className="rounded-full h-14 px-12 text-lg font-black shadow-xl shadow-primary/20" onClick={() => window.location.href = '/grammar'}>
            Hoàn tất & Quay về
         </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
         <div className="text-xs font-black uppercase tracking-widest text-primary">Câu hỏi {currentIndex + 1} / {exercises.length}</div>
         <div className="flex gap-1">
            {exercises.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-primary' : i < currentIndex ? 'bg-primary/30' : 'bg-muted'}`} 
              />
            ))}
         </div>
      </div>

      <Card className="rounded-3xl border-none shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 md:p-12 space-y-8 flex-1">
           <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Thử thách</span>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-4">{currentEx.question}</h3>
           </div>

           <div className="pt-4">
              {currentEx.type === 'MULTIPLE_CHOICE' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentEx.optionsJson as string[]).map((option) => (
                    <Button
                      key={option}
                      variant={selectedOption === option ? 'default' : 'outline'}
                      className={`h-16 rounded-2xl text-lg font-medium transition-all ${selectedOption === option ? 'shadow-lg shadow-primary/20 border-primary' : 'hover:border-primary/40 hover:bg-primary/5'}`}
                      onClick={() => !feedback && setSelectedOption(option)}
                      disabled={!!feedback}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input 
                    placeholder="Nhập câu trả lời của bạn..." 
                    className="h-16 text-xl rounded-2xl bg-muted/50 border-none shadow-inner"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={!!feedback}
                  />
                </div>
              )}
           </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={`p-8 border-t-2 ${feedback.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20'}`}
            >
              <div className="flex items-start gap-4">
                 <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${feedback.isCorrect ? 'bg-green-500 text-white' : 'bg-destructive text-white'}`}>
                    {feedback.isCorrect ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
                 </div>
                 <div className="space-y-2">
                    <h4 className={`text-xl font-black ${feedback.isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                       {feedback.isCorrect ? 'Chính xác!' : 'Chưa đúng rồi...'}
                    </h4>
                    {!feedback.isCorrect && (
                       <p className="text-lg font-bold">Đáp án đúng: <span className="text-primary">{feedback.correctAnswer}</span></p>
                    )}
                    <div className="mt-4 p-4 bg-background/50 rounded-2xl border border-border/40 space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50">
                          <MessageSquare className="h-3 w-3" /> Giải thích chi tiết
                       </div>
                       <p className="text-muted-foreground italic leading-relaxed">{feedback.explanation}</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="p-8 pt-4 flex gap-4">
           {feedback ? (
             <Button size="lg" className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 gap-3" onClick={handleNext}>
                Tiếp tục bài học <ArrowRight className="h-6 w-6" />
             </Button>
           ) : (
             <Button 
               size="lg" 
               className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20" 
               onClick={handleCheck}
               disabled={isChecking || (!userInput && !selectedOption)}
             >
                {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra đáp án'}
             </Button>
           )}
        </CardContent>
      </Card>
      
      {!feedback && (
        <div className="flex justify-center">
           <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary rounded-full">
              <HelpCircle className="h-4 w-4" /> Tôi cần gợi ý
           </Button>
        </div>
      )}
    </div>
  );
};

export default GrammarExerciseComponent;
