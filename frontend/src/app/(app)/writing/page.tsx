'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Search, BookOpen, Mail, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

const WritingPage = () => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, [activeTab]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/writing/prompts', {
        params: { type: activeTab === 'ALL' ? undefined : activeTab }
      });
      setPrompts(response.data);
    } catch (error) {
      console.error('Failed to fetch writing prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'Tất cả', icon: PenTool },
    { id: 'EMAIL', label: 'Email', icon: Mail },
    { id: 'ESSAY', label: 'Essay', icon: FileText },
    { id: 'IELTS_TASK_1', label: 'IELTS Task 1', icon: BookOpen },
    { id: 'IELTS_TASK_2', label: 'IELTS Task 2', icon: FileText },
  ];

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Trung Tâm <span className="text-primary italic">Viết</span></h1>
          <p className="text-muted-foreground italic text-lg">"Chinh phục mọi dạng bài viết với sự hỗ trợ của AI bản xứ."</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm chủ đề..." 
            className="pl-10 rounded-2xl bg-card/50 border-border/40 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {loading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)
         ) : filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt, index) => (
               <motion.div
                 key={prompt.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
               >
                  <Link href={`/writing/${prompt.id}`}>
                     <Card className="group h-full rounded-[2.5rem] border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-card to-background overflow-hidden flex flex-col">
                        <CardHeader className="p-8 pb-4">
                           <div className="flex justify-between items-start mb-4">
                              <Badge className="rounded-lg bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase px-3 py-1">
                                 {prompt.type.replace(/_/g, ' ')}
                              </Badge>
                              <div className="flex gap-2">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Level {prompt.level}</span>
                                <Badge variant="outline" className="text-[8px] py-0 border-primary/20 text-primary">{prompt.topic}</Badge>
                              </div>
                           </div>
                           <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-1">{prompt.title}</CardTitle>
                           <CardDescription className="text-sm font-medium italic mt-2 line-clamp-2 leading-relaxed">
                              {prompt.description}
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex-grow">
                          <div className="bg-muted/30 rounded-2xl p-4 border border-border/20 text-xs font-medium text-muted-foreground line-clamp-3 italic">
                             "{prompt.requirements}"
                          </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 flex items-center justify-between">
                           <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> ~{prompt.targetWords} words</span>
                              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> AI Feedback</span>
                           </div>
                           <div className="h-12 px-6 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-xl group-hover:shadow-primary/40 font-black text-sm gap-2">
                              Viết ngay <ChevronRight className="h-4 w-4" />
                           </div>
                        </CardFooter>
                     </Card>
                  </Link>
               </motion.div>
            ))
         ) : (
            <div className="col-span-full py-20 text-center opacity-40 italic">Chưa có đề bài trong mục này.</div>
         )}
      </div>
    </div>
  );
};

export default WritingPage;
