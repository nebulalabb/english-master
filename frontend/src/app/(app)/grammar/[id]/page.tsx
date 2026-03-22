'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BookOpen, Lightbulb, PlayCircle, CheckCircle2, Info, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import GrammarExerciseComponent from '@/components/grammar/GrammarExercise';

const GrammarDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lesson');

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/grammar/topics/${id}`);
      setTopic(response.data);
    } catch (error) {
      console.error('Failed to fetch grammar topic:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-8 p-8">
       <Skeleton className="h-12 w-48 rounded-full" />
       <Skeleton className="h-[600px] w-full rounded-3xl" />
    </div>
  );

  if (!topic) return <div>Không tìm thấy bài học.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => router.push('/grammar')} className="rounded-full gap-2">
            <ChevronLeft className="h-5 w-5" /> Quay lại
         </Button>
         <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push('/')}>
               <Home className="h-4 w-4" />
            </Button>
         </div>
      </div>

      <header className="space-y-4">
         <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
               {topic.level}
            </span>
            <span className="text-muted-foreground italic text-sm">Chủ điểm ngữ pháp</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-black tracking-tight">{topic.title}</h1>
         <p className="text-xl text-muted-foreground italic border-l-4 border-primary/30 pl-4">
            {topic.description}
         </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <TabsList className="grid w-full grid-cols-2 p-1 h-14 bg-muted/50 rounded-2xl border border-border/40">
            <TabsTrigger value="lesson" className="rounded-xl font-bold gap-2 text-base data-[state=active]:bg-background data-[state=active]:shadow-lg">
               <BookOpen className="h-5 w-5" /> Bài học lý thuyết
            </TabsTrigger>
            <TabsTrigger value="exercises" className="rounded-xl font-bold gap-2 text-base data-[state=active]:bg-background data-[state=active]:shadow-lg">
               <PlayCircle className="h-5 w-5" /> Thực hành bài tập
            </TabsTrigger>
         </TabsList>

         <div className="mt-8">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
               >
                  <TabsContent value="lesson" className="space-y-8 mt-0 focus-visible:ring-0">
                     {topic.contentJson?.sections?.map((section: any, idx: number) => (
                        <Card key={idx} className="border-none shadow-xl shadow-muted/50 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
                           <CardHeader className="bg-primary/5 pb-2">
                              <CardTitle className="text-2xl font-black flex items-center gap-3 text-primary">
                                 <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">
                                    {idx + 1}
                                 </div>
                                 {section.title}
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="p-8 prose prose-lg dark:prose-invert max-w-none">
                              <p className="text-lg leading-relaxed">{section.content}</p>
                           </CardContent>
                        </Card>
                     ))}

                     {topic.contentJson?.quickNotes && (
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-8 rounded-3xl border-2 border-dashed border-yellow-500/30 space-y-4">
                           <div className="flex items-center gap-2 text-yellow-600 font-black uppercase tracking-widest text-sm">
                              <Lightbulb className="h-5 w-5" /> Ghi nhớ nhanh
                           </div>
                           <p className="text-xl font-bold italic line-clamp-3">
                              "{topic.contentJson.quickNotes}"
                           </p>
                        </div>
                     )}

                     <div className="pt-8 flex justify-center">
                        <Button 
                           size="lg" 
                           onClick={() => setActiveTab('exercises')}
                           className="h-16 px-12 text-xl font-black rounded-full shadow-2xl shadow-primary/30 gap-3 group"
                        >
                           Bắt đầu luyện tập <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </div>
                  </TabsContent>

                  <TabsContent value="exercises" className="mt-0 focus-visible:ring-0">
                     {topic.exercises && topic.exercises.length > 0 ? (
                        <GrammarExerciseComponent exercises={topic.exercises} />
                     ) : (
                        <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-border/60">
                           <Info className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                           <p className="text-muted-foreground italic">Chưa có bài tập cho chủ điểm này.</p>
                        </div>
                     )}
                  </TabsContent>
               </motion.div>
            </AnimatePresence>
         </div>
      </Tabs>
    </div>
  );
};

export default GrammarDetailPage;
