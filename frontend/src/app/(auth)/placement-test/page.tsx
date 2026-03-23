'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trophy, ArrowRight, Sparkles, Brain, Zap, Target, Star, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

function IconArrowRight() {
  return (
    <svg className="arrow transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function PlacementTestPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (user?.hasCompletedPlacementTest) {
      router.push('/');
      return;
    }
    fetchQuestions();
  }, [user, router]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/placement-test/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/placement-test/submit', { answers });
      setResult(response.data);
      updateUser({ hasCompletedPlacementTest: true, level: response.data.level });
    } catch (error) {
      console.error('Failed to submit test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="auth-root flex items-center justify-center p-6 bg-slate-50/50">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full shadow-lg"
        />
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="auth-root flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-20 w-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mb-6 border border-amber-100 mx-auto shadow-sm">
             <Brain className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Chưa có câu hỏi nào</h2>
          <p className="text-slate-500 font-bold mb-8 max-w-md mx-auto">Hiện tại bài kiểm tra năng lực đang được cập nhật. Vui lòng quay lại sau!</p>
          <Button 
            onClick={() => router.push('/')}
            className="btn-submit !w-auto !px-10"
          >
            Quay lại Trang chủ
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion && !result) return null;

  return (
    <div className="auth-root">
      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="left-panel">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />

        <div className="chip chip-1">
          <div className="dot" style={{ background: '#6BCB77' }} />
          🔥 Streak 30 ngày
        </div>
        <div className="chip chip-2">
          <div className="dot" style={{ background: '#FFD93D' }} />
          ⭐ 1,240 XP
        </div>
        <div className="chip chip-3">
          <div className="dot" style={{ background: '#A78BFA' }} />
          🏅 Badge mới!
        </div>
        <div className="chip chip-4">
          <div className="dot" style={{ background: '#FF6B35' }} />
          📚 850 từ đã học
        </div>

        <div className="brand">
          <div className="brand-logo overflow-hidden">
            <Image src="/logo.png" alt="NebulaEnglish Logo" width={160} height={160} className="object-contain" />
          </div>
          <div className="brand-name">NebulaEnglish</div>
          <div className="brand-tagline">Học tiếng Anh thông minh hơn mỗi ngày</div>
        </div>

        <div className="illustration">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl border border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 leading-none">Kiểm tra năng lực</h3>
                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">Placement Test</p>
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Chúng tôi sẽ đánh giá trình độ hiện tại của bạn để đề xuất lộ trình học tập phù hợp nhất. Đừng quá lo lắng, hãy làm hết sức mình! 🚀
            </p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">5</div>
            <div className="stat-label">Cấp độ</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">AI</div>
            <div className="stat-label">Đánh giá</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">10p</div>
            <div className="stat-label">Thời gian</div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="right-panel">
        <div className="form-container" style={{ maxWidth: result ? '500px' : '560px' }}>
          
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-8"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex h-24 w-24 bg-emerald-50 rounded-[2.5rem] items-center justify-center relative mb-4"
                >
                  <Trophy className="h-12 w-12 text-emerald-500 z-10" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-100 rounded-[2.5rem]"
                  />
                </motion.div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tuyệt vời!</h1>
                  <p className="text-slate-500 font-bold">Bạn đã hoàn thành bài kiểm tra năng lực.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Trình độ</p>
                    <p className="text-2xl font-black text-indigo-600">{result.level}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">XP Nhận được</p>
                    <p className="text-2xl font-black text-amber-500">+{result.xpEarned || 100}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push('/')}
                  className="btn-submit"
                >
                  Vào Dashboard <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-10"
              >
                {/* Header info */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between items-end">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                      <Star className="h-3 w-3 text-indigo-500 fill-indigo-500" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        Câu hỏi {currentIndex + 1} / {questions.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-black text-indigo-600">{Math.round(progress)}%</span>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                    {currentQuestion.text}
                  </h2>
                  
                  {currentQuestion.instruction && (
                    <p className="text-slate-400 font-bold italic text-lg">{currentQuestion.instruction}</p>
                  )}
                </div>

                {/* Options */}
                <RadioGroup 
                  value={answers[currentQuestion.id] || ''} 
                  onValueChange={(val: string) => handleAnswer(currentQuestion.id, val)}
                  className="grid grid-cols-1 gap-4"
                >
                  {currentQuestion.options.map((option: string, i: number) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    return (
                      <Label
                        key={i}
                        htmlFor={`option-${i}`}
                        className={`
                          relative flex items-center p-6 rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2
                          ${isSelected 
                            ? 'bg-indigo-50 border-indigo-600 shadow-xl shadow-indigo-100/50 translate-x-1' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'
                          }
                        `}
                      >
                        <RadioGroupItem value={option} id={`option-${i}`} className="sr-only" />
                        <div className="flex items-center gap-5 w-full">
                           <div className={`
                             h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors
                             ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}
                           `}>
                              {String.fromCharCode(65 + i)}
                           </div>
                           <span className={`text-base font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                              {option}
                           </span>
                           {isSelected && (
                             <CheckCircle2 className="h-5 w-5 text-indigo-600 ml-auto" />
                           )}
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>

                {/* Footer action */}
                <div className="pt-6 border-t border-slate-100">
                  <Button
                    onClick={nextQuestion}
                    disabled={!answers[currentQuestion.id] || isSubmitting}
                    className="btn-submit"
                  >
                    {isSubmitting ? "Đang chấm điểm..." : (
                      <>
                        {currentIndex === questions.length - 1 ? 'Nộp bài & Xem kết quả' : 'Tiếp tục'} 
                        <IconArrowRight />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
