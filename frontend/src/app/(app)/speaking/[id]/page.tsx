'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Mic, History, Award, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import SpeakingPracticer from '@/components/speaking/SpeakingPracticer';

const SpeakingDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/speaking/exercises/${id}`);
      setExercise(response.data);
    } catch (error) {
      console.error('Failed to fetch speaking exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="max-w-4xl mx-auto p-8 space-y-8">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-[500px] rounded-[3rem]" />
     </div>
  );

  if (!exercise) return <div className="p-20 text-center italic">Không tìm thấy nội dung bài nói.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => router.push('/speaking')} className="rounded-full gap-2 transition-all hover:pl-2">
            <ChevronLeft className="h-5 w-5" /> Quay lại danh sách
         </Button>
         <div className="flex gap-2">
            <Badge className="rounded-full bg-primary/10 text-primary border-none px-4 py-1 font-black">
               {exercise.type.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 font-bold">
               {exercise.level}
            </Badge>
         </div>
      </div>

      <header className="space-y-4">
         <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
               <Mic className="h-6 w-6" />
            </div>
            <div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight">{exercise.title}</h1>
               <p className="text-muted-foreground font-medium italic">{exercise.description}</p>
            </div>
         </div>
      </header>

      <Card className="rounded-[3rem] border-none shadow-2xl bg-gradient-to-b from-card to-background overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Mic className="h-32 w-32" />
         </div>
         <CardContent className="p-8 md:p-12 relative z-10">
            <SpeakingPracticer exercise={exercise} />
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="rounded-[2.5rem] border-border/40 bg-card/50 overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" /> Mẹo phát âm
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4 text-sm text-muted-foreground font-medium leading-relaxed">
               <p>• Hãy hít thở sâu và thư giãn trước khi bắt đầu ghi âm.</p>
               <p>• Chú ý vào trọng âm của từ và ngữ điệu của câu (lên giọng cuối câu hỏi, xuống giọng cuối câu trần thuật).</p>
               <p>• Sử dụng tai nghe có mic để đạt được kết quả nhận diện chính xác nhất.</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-border/40 bg-primary/5 overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" /> Thành tích
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4 text-sm font-medium">
               <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Điểm cao nhất</span>
                  <span className="font-black text-primary">--</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Số lần luyện tập</span>
                  <span className="font-black text-primary">0</span>
               </div>
               <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge className="bg-orange-500/10 text-orange-600 border-none">Đang học</Badge>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default SpeakingDetailPage;
