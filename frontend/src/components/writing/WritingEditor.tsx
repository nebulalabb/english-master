'use client';

// Integrated Textarea component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, BarChart2, Info, CheckCircle, AlertCircle, Sparkles, BookOpen, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import axios from '@/lib/axios';

interface WritingEditorProps {
  prompt: any;
  onSuccess: (result: any) => void;
}

const WritingEditor: React.FC<WritingEditorProps> = ({ prompt, onSuccess }) => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  const progress = Math.min((wordCount / prompt.targetWords) * 100, 100);

  const handleSubmit = async () => {
    if (wordCount < 10) {
      setError('Bài viết quá ngắn. Hãy viết ít nhất 10 từ để AI có thể phân tích.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const response = await axios.post(`/writing/prompts/${prompt.id}/submit`, { content });
      onSuccess(response.data);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError('Đã xảy ra lỗi khi gửi bài. Hãy thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-black uppercase tracking-widest text-primary/40">Nội dung bài viết</span>
            <div className="text-right">
              <span className={`text-2xl font-black ${wordCount >= prompt.targetWords ? 'text-green-500' : 'text-primary'}`}>
                {wordCount}
              </span>
              <span className="text-muted-foreground text-sm font-bold ml-1">/ {prompt.targetWords} words</span>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <Textarea 
              placeholder="Bắt đầu viết tại đây..."
              className="min-h-[400px] rounded-[1.5rem] border-border/40 bg-card p-8 text-lg leading-relaxed focus:ring-primary/20 resize-none relative z-10"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Progress value={progress} className="h-2 rounded-full bg-primary/10" />
        </div>

        <div className="flex justify-end gap-4">
          {error && (
            <div className="flex items-center gap-2 text-destructive font-bold text-sm mr-auto animate-pulse">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <Button 
            className="rounded-full h-14 px-10 gap-2 font-black text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI đang chấm bài...
              </>
            ) : (
              <>
                Nộp bài & Chấm điểm <Send className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2.5rem] border-border/40 bg-card shadow-xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Yêu cầu đề bài
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <p className="text-sm font-medium leading-relaxed italic">
                "{prompt.requirements}"
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary/40">Gợi ý từ giáo viên AI</h4>
              <ul className="space-y-3">
                {prompt.tipsJson?.map((tip: string, i: number) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 text-sm font-medium text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 bg-gradient-to-br from-primary/5 to-transparent shadow-xl">
           <CardContent className="p-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                 <Sparkles className="h-6 w-6" />
              </div>
              <div>
                 <h4 className="font-black text-lg">AI Feedback</h4>
                 <p className="text-xs font-medium text-muted-foreground italic">Phân tích chuyên sâu bởi Gemini 1.5</p>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WritingEditor;
