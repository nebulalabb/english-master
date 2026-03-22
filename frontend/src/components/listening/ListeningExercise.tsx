'use client';

import React, { useState } from 'react';
import { Check, X, ArrowRight, Sparkles, MessageSquare, ListTodo, ThumbsUp, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

interface ListeningExerciseProps {
  exerciseId: string;
  questions: any[];
}

const ListeningExerciseComponent: React.FC<ListeningExerciseProps> = ({ exerciseId, questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    // Add current answer
    const newAnswers = [...answers, { 
      questionId: currentQ.id, 
      answer: currentQ.type === 'MULTIPLE_CHOICE' ? selectedOption! : currentAnswer 
    }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer('');
      setSelectedOption(null);
    } else {
      submitAll(newAnswers);
    }
  };

  const submitAll = async (allAnswers: any[]) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/listening/exercises/${exerciseId}/submit`, { answers: allAnswers });
      setFinalResult(response.data);
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to submit listening answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return (
     <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-xl italic uppercase tracking-widest text-primary">Đang chấm điểm...</p>
     </div>
  );

  if (isCompleted) {
    return (
      <div className="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar max-h-[600px]">
         <div className="text-center space-y-4">
            <div className="h-20 w-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
               <Sparkles className="h-10 w-10 text-green-600" />
            </div>
            <div>
               <h2 className="text-3xl font-black">Kết quả của bạn</h2>
               <p className="text-muted-foreground">Bạn đã làm rất tốt!</p>
            </div>
            <div className="text-6xl font-black text-primary">
               {Math.round(finalResult.score)}%
            </div>
            <p className="font-bold text-sm text-muted-foreground uppercase tracking-widest">
               Đúng {finalResult.correctCount} / {finalResult.totalQuestions} câu
            </p>
         </div>

         <div className="space-y-4 pt-4 border-t border-border/40">
            {finalResult.results.map((res: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-2xl border ${res.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-destructive/5 border-destructive/20'}`}>
                 <div className="flex items-start gap-3">
                    {res.isCorrect ? <ThumbsUp className="h-5 w-5 text-green-600 mt-1" /> : <X className="h-5 w-5 text-destructive mt-1" />}
                    <div className="space-y-1">
                       <p className={`font-bold ${res.isCorrect ? 'text-green-700' : 'text-destructive'}`}>Câu hỏi {idx + 1}</p>
                       {!res.isCorrect && (
                          <p className="text-sm">Đáp án đúng: <span className="font-black text-primary">{res.correctAnswer}</span></p>
                       )}
                       <div className="mt-2 p-3 bg-white/50 rounded-xl text-xs italic text-muted-foreground">
                          {res.explanation}
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         <Button className="w-full h-14 rounded-2xl font-black text-lg gap-3" onClick={() => window.location.href = '/listening'}>
            Quay về danh sách <Home className="h-5 w-5" />
         </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
       <div className="p-8 space-y-8 flex-1">
          <div className="flex items-center justify-between">
             <span className="text-xs font-black uppercase tracking-widest text-primary/40">Câu hỏi {currentIndex + 1} / {questions.length}</span>
             <div className="h-2 flex-1 mx-4 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  className="h-full bg-primary"
                />
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                   <ListTodo className="h-3 w-3" /> {currentQ.type.replace('_', ' ')}
                </div>
                <h3 className="text-2xl font-bold leading-tight">{currentQ.questionText}</h3>
             </div>

             <div className="pt-4">
                {currentQ.type === 'MULTIPLE_CHOICE' ? (
                  <div className="space-y-3">
                    {(currentQ.optionsJson as string[]).map((option) => (
                      <Button
                        key={option}
                        variant={selectedOption === option ? 'default' : 'outline'}
                        className={`w-full h-14 justify-start px-6 rounded-2xl text-base font-medium transition-all ${selectedOption === option ? 'shadow-lg shadow-primary/20 bg-primary border-primary' : 'hover:bg-primary/5 hover:border-primary/40'}`}
                        onClick={() => setSelectedOption(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Input 
                    placeholder="Nhập câu trả lời..." 
                    className="h-16 text-xl rounded-2xl bg-muted/50 border-none shadow-inner px-6"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                  />
                )}
             </div>
          </div>
       </div>

       <div className="p-8 pt-0 mt-auto">
          <Button 
            size="lg" 
            className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 gap-3"
            onClick={handleNext}
            disabled={(currentQ.type === 'MULTIPLE_CHOICE' && !selectedOption) || (currentQ.type !== 'MULTIPLE_CHOICE' && !currentAnswer)}
          >
             {currentIndex < questions.length - 1 ? 'Câu kế tiếp' : 'Kết thúc & Chấm điểm'} <ArrowRight className="h-6 w-6" />
          </Button>
       </div>
    </div>
  );
};

export default ListeningExerciseComponent;
