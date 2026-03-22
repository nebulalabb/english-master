'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Loader2,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const LearningPage = () => {
  const { lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/lessons/${lessonId}`);
      setLesson(response.data);
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      toast.error('Failed to load lesson content');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setCompleting(true);
      const res = await axios.post(`/lessons/${lessonId}/complete`);
      setCompleted(true);
      toast.success(res.data.message || 'Lesson completed!');
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setCompleting(false);
    }
  };

  const handleExit = () => {
    if (window.confirm('Bạn có chắc chắn muốn dừng học? Tiến độ hiện tại có thể không được lưu.')) {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center"
      >
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
            className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/20"
          >
            <Award className="h-16 w-16 text-primary" />
          </motion.div>
          {/* Simple particle animation placeholders */}
          <div className="absolute -top-4 -left-4 h-4 w-4 rounded-full bg-yellow-400 animate-ping" />
          <div className="absolute -bottom-4 -right-4 h-4 w-4 rounded-full bg-blue-400 animate-ping delay-300" />
        </div>

        <h1 className="mb-2 text-4xl font-black tracking-tight">Tuyệt vời!</h1>
        <p className="mb-8 text-xl text-muted-foreground">Bạn đã hoàn thành bài học "{lesson.title}"</p>

        <div className="grid w-full max-w-sm grid-cols-2 gap-4 mb-10">
          <Card className="p-4 bg-primary/10 border-none shadow-none">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="text-3xl font-black text-primary">+{lesson.xpReward}</div>
              <div className="text-xs font-bold uppercase text-primary/60">XP nhận được</div>
            </CardContent>
          </Card>
          <Card className="p-4 bg-green-500/10 border-none shadow-none">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="text-3xl font-black text-green-600">100%</div>
              <div className="text-xs font-bold uppercase text-green-600/60">Chính xác</div>
            </CardContent>
          </Card>
        </div>

        <Button 
          size="lg" 
          className="h-14 w-full max-w-sm text-lg font-bold shadow-xl shadow-primary/20"
          onClick={() => router.push(`/courses/${lesson.unit.courseId}`)}
        >
          Quay lại trang chính
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <nav className="flex h-20 items-center justify-between border-b px-6 lg:px-12 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={handleExit}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="mx-8 flex-1">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            <span>Tiến độ bài học</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted" />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm font-bold text-muted-foreground">Chương {lesson.unit?.title || "1"}</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-4 text-center"
          >
            <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/10">
              {lesson.type}
            </Badge>
            <h1 className="text-3xl font-extrabold lg:text-5xl tracking-tight">
              {lesson.title}
            </h1>
          </motion.div>

          <Card className="border-none bg-muted/40 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-inner shadow-black/5">
            <CardContent className="p-0 space-y-8">
              {/* Dynamic Content based on type - Simplified for now */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {typeof lesson.contentJson === 'string' ? lesson.contentJson : JSON.stringify(lesson.contentJson, null, 2)}
              </div>

              {lesson.type === 'VOCABULARY' && (
                <div className="flex flex-col items-center space-y-4">
                  <Button variant="outline" size="lg" className="h-16 w-16 rounded-full p-0 border-primary/20 hover:bg-primary/10">
                    <Volume2 className="h-8 w-8 text-primary" />
                  </Button>
                  <p className="text-sm font-medium text-muted-foreground italic">Nhấn để nghe phát âm</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer / Actions */}
      <footer className="h-24 border-t px-6 lg:px-12 flex items-center justify-center bg-background/80 backdrop-blur-md">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-muted-foreground italic">Tiếp tục cố gắng! Bạn đang làm rất tốt.</p>
          </div>
          <Button 
            size="xl" 
            className="h-14 px-10 font-black text-lg shadow-lg shadow-primary/20"
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? "Đang lưu..." : "Đã hiểu, Tiếp tục"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};


export default LearningPage;
