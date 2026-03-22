'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Headphones, ListChecks, CheckCircle2, Home, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import AudioPlayer from '@/components/listening/AudioPlayer';
import ListeningExerciseComponent from '@/components/listening/ListeningExercise';

const ListeningDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('audio');

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/listening/exercises/${id}`);
      setExercise(response.data);
    } catch (error) {
      console.error('Failed to fetch listening exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-8 p-8 max-w-5xl mx-auto">
       <Skeleton className="h-10 w-48 rounded-full" />
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] md:col-span-2 rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
       </div>
    </div>
  );

  if (!exercise) return <div>Không tìm thấy nội dung bài nghe.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-8">
      <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => router.push('/listening')} className="rounded-full gap-2">
            <ChevronLeft className="h-5 w-5" /> Quay lại
         </Button>
         <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm font-black">
            {exercise.level}
         </Badge>
      </div>

      <header className="space-y-4">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
               <Headphones className="h-5 w-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{exercise.title}</h1>
         </div>
         <p className="text-xl text-muted-foreground italic max-w-3xl">
            {exercise.description}
         </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <AudioPlayer src={exercise.audioUrl} transcript={exercise.transcript} />
            
            <div className="hidden lg:block">
               <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-primary/5 to-purple-500/5 p-8">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                        <Award className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-black text-xl">Mục tiêu bài nghe</h4>
                        <p className="text-sm text-muted-foreground">Kỹ năng đạt được sau khi hoàn tất</p>
                     </div>
                  </div>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Nhận biết thông tin cụ thể trong hội thoại
                     </li>
                     <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Làm quen với ngữ điệu và trọng âm tự nhiên
                     </li>
                     <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Mở rộng vốn từ vựng theo chủ đề {exercise.topic}
                     </li>
                  </ul>
               </Card>
            </div>
         </div>

         <div className="lg:col-span-1">
            <Card className="rounded-[2.5rem] border-none shadow-2xl h-full flex flex-col overflow-hidden">
               <CardHeader className="bg-primary text-white p-8">
                  <div className="flex items-center gap-3 mb-2">
                     <ListChecks className="h-6 w-6" />
                     <CardTitle className="text-2xl font-black">Phần luyện tập</CardTitle>
                  </div>
                  <CardDescription className="text-white/80 font-medium">
                     {exercise.questions?.length || 0} câu hỏi kiểm tra khả năng nghe hiểu của bạn.
                  </CardDescription>
               </CardHeader>
               <CardContent className="p-0 flex-1 flex flex-col">
                  {exercise.questions && exercise.questions.length > 0 ? (
                    <ListeningExerciseComponent exerciseId={exercise.id} questions={exercise.questions} />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40 italic">
                       Chưa có câu hỏi cho bài nghe này.
                    </div>
                  )}
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default ListeningDetailPage;
