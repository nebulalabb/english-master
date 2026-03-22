'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Search, Headphones, BookOpen, MessageCircle, Play, Award, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

const SpeakingPage = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchExercises();
  }, [activeTab]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/speaking/exercises', {
        params: { type: activeTab === 'ALL' ? undefined : activeTab }
      });
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch speaking exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'Tất cả', icon: Mic },
    { id: 'PRONUNCIATION', label: 'Phát âm', icon: Headphones },
    { id: 'READ_ALOUD', label: 'Đọc thành tiếng', icon: BookOpen },
    { id: 'QUESTION_ANSWER', label: 'Phản xạ', icon: MessageCircle },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Phòng Luyện <span className="text-primary italic">Nói</span></h1>
        <p className="text-muted-foreground italic text-lg line-clamp-1">"Tự tin giao tiếp, làm chủ giọng đọc chuẩn bản xứ."</p>
      </div>

      <div className="bg-card/50 backdrop-blur-sm p-2 rounded-3xl border border-border/40 inline-flex overflow-x-auto no-scrollbar max-w-full">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent h-12 gap-2 p-1">
               {categories.map(cat => (
                 <TabsTrigger 
                   key={cat.id} 
                   value={cat.id}
                   className="rounded-2xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 transition-all font-bold"
                 >
                   <cat.icon className="h-4 w-4 mr-2" /> {cat.label}
                 </TabsTrigger>
               ))}
            </TabsList>
         </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
            Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-3xl" />)
         ) : exercises.length > 0 ? (
            exercises.map((ex, index) => (
               <motion.div
                 key={ex.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: index * 0.05 }}
               >
                  <Link href={`/speaking/${ex.id}`}>
                     <Card className="group h-full rounded-[2rem] border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-card to-background overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Mic className="h-24 w-24 text-primary" />
                        </div>
                        <CardHeader className="p-8 pb-4">
                           <div className="flex justify-between items-start mb-4">
                              <Badge className="rounded-lg bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase px-3 py-1">
                                 {ex.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Level {ex.level}</span>
                           </div>
                           <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">{ex.title}</CardTitle>
                           <CardDescription className="text-sm font-medium italic mt-2 line-clamp-2">{ex.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-8 pt-0 flex items-center justify-between">
                           <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                              <span className="flex items-center gap-1"><Award className="h-3 w-3" /> Chấm điểm AI</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 5-10s</span>
                           </div>
                           <div className="h-10 w-10 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-xl group-hover:shadow-primary/40">
                              <Play className="h-4 w-4 fill-current" />
                           </div>
                        </CardFooter>
                     </Card>
                  </Link>
               </motion.div>
            ))
         ) : (
            <div className="col-span-full py-20 text-center opacity-40 italic">Chưa có bài luyện nói trong mục này.</div>
         )}
      </div>
    </div>
  );
};

export default SpeakingPage;
