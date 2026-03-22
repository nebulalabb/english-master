'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight, Search, Filter, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

const GrammarPage = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [selectedLevel]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/grammar/topics', {
        params: { level: selectedLevel || undefined }
      });
      setTopics(response.data);
    } catch (error) {
      console.error('Failed to fetch grammar topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Ngữ pháp <span className="text-primary italic">Tiếng Anh</span></h1>
        <p className="text-muted-foreground italic text-lg">"Nắm vững cấu trúc, tự tin giao tiếp."</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-3xl border border-border/40 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm chủ điểm ngữ pháp..." 
            className="pl-10 h-12 rounded-2xl bg-background border-none shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          <Button 
            variant={selectedLevel === null ? 'default' : 'ghost'} 
            className="rounded-full px-6"
            onClick={() => setSelectedLevel(null)}
          >
            Tất cả
          </Button>
          {levels.map(lvl => (
            <Button 
              key={lvl} 
              variant={selectedLevel === lvl ? 'default' : 'ghost'} 
              className="rounded-full px-6 font-bold"
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-3xl" />)
        ) : filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/grammar/${topic.id}`}>
                <Card className="group relative overflow-hidden h-full rounded-3xl border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-card to-muted/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  
                  <CardHeader className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 px-3">
                        {topic.level}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Clock className="h-3 w-3" /> 20 phút
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">{topic.title}</CardTitle>
                    <CardDescription className="text-base italic line-clamp-2">{topic.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                               <Circle className="h-3 w-3 text-muted-foreground" />
                            </div>
                          ))}
                       </div>
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {topic._count?.exercises || 0} bài tập
                       </span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                       <ChevronRight className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-12 w-12 text-muted-foreground opacity-20" />
             </div>
             <h3 className="text-xl font-bold">Không tìm thấy bài học nào</h3>
             <p className="text-muted-foreground">Hãy thử tìm kiếm với từ khóa khác hoặc chọn trình độ khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarPage;
