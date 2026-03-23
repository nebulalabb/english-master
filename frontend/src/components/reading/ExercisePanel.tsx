'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, XCircle, AlertCircle, HelpCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface ExercisePanelProps {
  questions: any[];
  onFinish: (score: number, details: any) => void;
  isSubmitting: boolean;
}

const ExercisePanel: React.FC<ExercisePanelProps> = ({ questions, onFinish, isSubmitting }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const currentQuestion = questions[currentIdx];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    const details = questions.map(q => {
      const isCorrect = answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correct++;
      return { questionId: q.id, isCorrect, userAnswer: answers[q.id] };
    });
    
    const score = (correct / questions.length) * 100;
    setEvaluation({ score, correct, total: questions.length, details });
    setShowResult(true);
    onFinish(score, details);
  };

  if (showResult && evaluation) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-gradient-to-br from-primary to-primary-foreground text-white overflow-hidden relative" style={{ background: '#E11D48' }}>
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="h-48 w-48" />
           </div>
           <CardContent className="p-12 flex flex-col items-center text-center space-y-6 relative z-10">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30">
                 <span className="text-4xl font-black">{Math.round(evaluation.score)}%</span>
              </div>
              <div className="space-y-2">
                 <h2 className="text-3xl font-black">Kết quả của bạn</h2>
                 <p className="text-xl font-medium opacity-80">Bạn đã trả lời đúng {evaluation.correct}/{evaluation.total} câu hỏi.</p>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-black gap-2 transition-all" onClick={() => setShowResult(false)}>
                 Xem lại đáp án <ArrowRight className="h-4 w-4" />
              </Button>
           </CardContent>
        </Card>

        <div className="space-y-6">
           {questions.map((q, i) => (
             <Card key={q.id} className="rounded-3xl border-border/40 overflow-hidden shadow-xl">
                <CardContent className="p-8 space-y-4">
                   <div className="flex justify-between items-start">
                      <Badge className={`rounded-xl ${evaluation.details[i].isCorrect ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'} border-none font-black text-[10px] uppercase px-3 py-1`}>
                         {evaluation.details[i].isCorrect ? 'Làm đúng' : 'Làm sai'}
                      </Badge>
                      <span className="text-xs font-black text-muted-foreground opacity-40">Câu hỏi {i+1}</span>
                   </div>
                   <p className="text-lg font-black leading-tight">{q.questionText}</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.optionsJson?.map((opt: string) => (
                        <div key={opt} className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${opt === q.correctAnswer ? 'bg-green-500/10 border-green-500/20 text-green-700' : opt === evaluation.details[i].userAnswer ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-muted/30 border-border/40 opacity-60'}`}>
                           {opt === q.correctAnswer ? <CheckCircle2 className="h-5 w-5" /> : opt === evaluation.details[i].userAnswer ? <XCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                           <span className="text-sm font-bold">{opt}</span>
                        </div>
                      ))}
                   </div>
                   {q.explanation && (
                     <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-3 mt-4">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                           <span className="font-black text-primary uppercase text-[10px] block mb-1">Giải thích:</span>
                           {q.explanation}
                        </div>
                     </div>
                   )}
                </CardContent>
             </Card>
           ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
         <div className="flex justify-between items-end mb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">Comprehension Check</h3>
            <span className="text-xs font-black text-muted-foreground">Câu {currentIdx + 1} / {questions.length}</span>
         </div>
         <Progress value={progress} className="h-2 rounded-full bg-primary/10" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={currentQuestion.id}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="space-y-8"
        >
           <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                {currentQuestion.questionText}
              </h2>

              <RadioGroup value={answers[currentQuestion.id]} onValueChange={handleAnswerChange} className="space-y-4">
                 {currentQuestion.optionsJson?.map((opt: string) => (
                    <Label
                      key={opt}
                      className={`flex items-center gap-4 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${answers[currentQuestion.id] === opt ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10' : 'bg-card border-border/40 hover:border-primary/20'}`}
                    >
                       <RadioGroupItem value={opt} className="h-6 w-6 border-2 border-primary" />
                       <span className="text-lg font-bold">{opt}</span>
                    </Label>
                 ))}
              </RadioGroup>
           </div>

           <div className="flex justify-between gap-4 pt-4 border-t border-border/40">
              <Button 
                variant="ghost" 
                className="rounded-full px-8 h-12 font-bold"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                Quay lại
              </Button>
              {currentIdx < questions.length - 1 ? (
                <Button 
                  className="rounded-full px-10 h-14 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105"
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  Câu tiếp theo <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button 
                  className="rounded-full px-12 h-16 font-black text-xl bg-primary text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:rotate-2"
                  onClick={handleSubmit}
                  disabled={!answers[currentQuestion.id] || isSubmitting}
                >
                  {isSubmitting ? 'Đang nộp bài...' : 'Hoàn thành bài đọc'}
                </Button>
              )}
           </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExercisePanel;
