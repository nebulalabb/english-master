'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, BookOpen, Clock, AlertCircle, Info, Sparkles, Layout, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import PassageViewer from '@/components/reading/PassageViewer';
import ExercisePanel from '@/components/reading/ExercisePanel';

const ReadingDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [passage, setPassage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPassage();
  }, [id]);

  const fetchPassage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/reading/passages/${id}`);
      setPassage(response.data);
    } catch (error) {
      console.error('Failed to fetch reading passage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (score: number, details: any) => {
    try {
      setIsSubmitting(true);
      await axios.post(`/reading/passages/${id}/submit`, {
        answers: details.map((d: any) => ({ questionId: d.questionId, answer: d.userAnswer }))
      });
    } catch (error) {
      console.error('Failed to submit reading answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
     <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-10 w-48 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-[600px] rounded-[3rem]" />
          <Skeleton className="h-[600px] rounded-[3rem]" />
        </div>
     </div>
  );

  if (!passage) return <div className="p-20 text-center italic">Không tìm thấy nội dung bài đọc.</div>;

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => router.push('/reading')} className="rounded-full gap-2 transition-all hover:pl-2">
            <ChevronLeft className="h-5 w-5" /> Quay lại thư viện
         </Button>
         <div className="flex gap-2">
            <Badge className="rounded-full bg-primary/10 text-primary border-none px-4 py-1 font-black">
               {passage.topic}
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 font-bold border-border">
               LEVEL {passage.level}
            </Badge>
         </div>
      </div>

      <header className="space-y-4">
         <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
               <Layout className="h-8 w-8" />
            </div>
            <div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight">{passage.title}</h1>
               <div className="flex items-center gap-2 text-muted-foreground font-medium italic">
                  <Clock className="h-4 w-4" /> <span>Ước tính {passage.durationMins} phút đọc</span>
               </div>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
         <section className="space-y-6 lg:sticky lg:top-24">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
               <BookOpen className="h-3 w-3" /> Văn bản bài đọc
            </h3>
            <Card className="rounded-[3rem] border-none shadow-2xl bg-card overflow-hidden">
               <CardContent className="p-10 md:p-12">
                  <PassageViewer content={passage.content} />
               </CardContent>
            </Card>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border/40 text-xs text-muted-foreground font-medium italic">
               <Sparkles className="h-4 w-4 text-primary" /> Bạn có thể bôi đen một từ bất kỳ để xem định nghĩa ngay lập tức.
            </div>
         </section>

         <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
               <Layout className="h-3 w-3" /> Bài tập thấu hiểu
            </h3>
            <Card className="rounded-[3rem] border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
               <CardContent className="p-10 md:p-12">
                  <ExercisePanel questions={passage.questions} onFinish={handleFinish} isSubmitting={isSubmitting} />
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
               <Card className="rounded-[2.5rem] border-border/40 bg-card overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                     <CardTitle className="text-sm font-black flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> Gợi ý
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-xs text-muted-foreground font-medium italic leading-relaxed">
                     Hãy đọc kỹ tiêu đề và các câu hỏi trước khi đọc chi tiết văn bản để nắm bắt ý chính.
                  </CardContent>
               </Card>
               <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                     <CardTitle className="text-sm font-black flex items-center gap-2 text-primary">
                        <Bookmark className="h-4 w-4" /> Kỹ thuật Reading
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-xs text-primary/60 font-black uppercase tracking-tighter">
                     Skimming & Scanning
                  </CardContent>
               </Card>
            </div>
         </section>
      </div>
    </div>
  );
};

export default ReadingDetailPage;
