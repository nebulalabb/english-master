'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RotateCcw, Volume2, Sparkles, CheckCircle2, XCircle, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from '@/lib/axios';

interface SpeakingPracticerProps {
  exercise: any;
}

const SpeakingPracticer: React.FC<SpeakingPracticerProps> = ({ exercise }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        handleSubmit(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError('Không thể nhận diện giọng nói. Hãy thử lại.');
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleStartRecording = () => {
    setError(null);
    setResult(null);
    setRecognizedText('');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    } else {
      setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (text: string) => {
    try {
      setIsProcessing(true);
      const response = await axios.post(`/speaking/exercises/${exercise.id}/submit`, {
        recognizedText: text
      });
      setResult(response.data);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Đã xảy ra lỗi khi xử lý kết quả.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playSample = () => {
    if (exercise.audioUrl) {
      const audio = new Audio(exercise.audioUrl);
      audio.play();
    } else {
      // Fallback: TTS
      const utterance = new SpeechSynthesisUtterance(exercise.targetText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
         <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-black text-primary/40 uppercase tracking-[0.3em]">Mục tiêu phát âm</span>
            <div className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
               {exercise.targetText}
            </div>
            {exercise.phonetic && (
               <div className="text-2xl font-medium text-muted-foreground font-serif italic">
                  {exercise.phonetic}
               </div>
            )}
         </div>

         <Button 
            variant="outline" 
            className="rounded-full h-12 px-6 gap-2 border-primary/20 hover:bg-primary/5 transition-all"
            onClick={playSample}
         >
            <Volume2 className="h-5 w-5 text-primary" /> Nghe mẫu bản xứ
         </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-12 relative">
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <BarChart2 className="h-64 w-64 text-primary" />
         </div>

         <div className="relative z-10 space-y-8 flex flex-col items-center">
            <motion.div 
               animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="relative"
            >
               {isRecording && (
                  <>
                     <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                     <div className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-pulse" />
                  </>
               )}
               <Button
                  size="icon"
                  className={`h-32 w-32 rounded-full shadow-2xl transition-all duration-500 ${isRecording ? 'bg-destructive hover:bg-destructive/90 scale-110 shadow-destructive/40' : 'bg-primary hover:bg-primary/90 shadow-primary/40'}`}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={isProcessing}
               >
                  {isRecording ? <Square className="h-12 w-12 fill-current" /> : <Mic className="h-16 w-16" />}
               </Button>
            </motion.div>

            <div className="text-center space-y-2">
               <p className={`text-xl font-black uppercase tracking-widest ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
                  {isRecording ? 'Đang ghi âm...' : isProcessing ? 'Đang phân tích...' : 'Nhấn để bắt đầu nói'}
               </p>
               {recognizedText && (
                  <p className="text-sm italic text-muted-foreground opacity-60">
                     Hệ thống nhận diện: "{recognizedText}"
                  </p>
               )}
            </div>
         </div>
      </div>

      <AnimatePresence>
         {result && (
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
               <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-gradient-to-br from-card to-background">
                  <div className="p-8 md:p-12 space-y-8">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                           <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <span className="text-4xl font-black text-primary">{result.score}%</span>
                           </div>
                           <div>
                              <h3 className="text-3xl font-black">Kết quả phân tích</h3>
                              <p className="text-muted-foreground flex items-center gap-2">
                                 <Sparkles className="h-4 w-4 text-yellow-500" /> 
                                 {result.score >= 80 ? 'Tuyệt vời! Gần như bản xứ.' : result.score >= 50 ? 'Khá tốt, hãy cải thiện nhé.' : 'Cần luyện tập thêm.'}
                              </p>
                           </div>
                        </div>
                        <Button className="rounded-full h-12 px-8 gap-2 font-bold shadow-xl shadow-primary/20" onClick={handleStartRecording}>
                           <RotateCcw className="h-5 w-5" /> Thử lại
                        </Button>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary/40">Chi tiết phát âm từng từ</h4>
                        <div className="flex flex-wrap gap-4">
                           {result.feedback.map((item: any, idx: number) => (
                              <div 
                                 key={idx} 
                                 className={`px-6 py-4 rounded-2xl border transition-all ${item.isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}
                              >
                                 <div className="text-2xl font-black">{item.word}</div>
                                 <div className="flex items-center gap-1 mt-1">
                                    {item.isCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                       {item.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </Card>
            </motion.div>
         )}
      </AnimatePresence>

      {error && (
         <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center font-bold">
            {error}
         </div>
      )}
    </div>
  );
};

export default SpeakingPracticer;
