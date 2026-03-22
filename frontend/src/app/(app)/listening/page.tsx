'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Search, Filter, Play, Clock, HeadphonesIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

const ListeningPage = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [selectedLevel]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/listening/exercises', {
        params: { level: selectedLevel || undefined }
      });
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch listening exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Luyện <span className="text-primary italic">Nghe</span></h1>
        <p className="text-muted-foreground italic text-lg">"Nghe nhiều, thấm nhanh, nói chuẩn."</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-3xl border border-border/40 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm bài nghe, chủ đề..." 
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : filteredExercises.length > 0 ? (
          filteredExercises.map((ex, index) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/listening/${ex.id}`}>
                <Card className="group relative overflow-hidden h-full rounded-3xl border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer bg-card/50">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                     {ex.thumbnail ? (
                       <img src={ex.thumbnail} alt={ex.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 to-purple-500/10">
                          <Headphones className="h-12 w-12 text-primary opacity-20" />
                       </div>
                     )}
                     <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 rounded-lg">
                           {ex.level}
                        </Badge>
                     </div>
                     <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border-white/20">
                        <Clock className="h-3 w-3" /> {Math.floor(ex.durationSec / 60)}:{String(ex.durationSec % 60).padStart(2, '0')}
                     </div>
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/40 scale-75 group-hover:scale-100 transition-transform">
                           <Play className="h-6 w-6 fill-current" />
                        </div>
                     </div>
                  </div>
                  
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{ex.title}</CardTitle>
                    <CardDescription className="text-sm italic line-clamp-2">{ex.description}</CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="p-5 pt-0 flex justify-between items-center mt-auto">
                    <span className="text-xs font-black uppercase tracking-widest text-primary/60">{ex.topic}</span>
                    <span className="text-xs font-bold text-muted-foreground">{ex._count?.questions || 0} câu hỏi</span>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-12 w-12 text-muted-foreground opacity-20" />
             </div>
             <h3 className="text-xl font-bold">Không tìm thấy bài nghe nào</h3>
             <p className="text-muted-foreground">Hãy thử tìm kiếm với từ khóa khác hoặc chọn trình độ khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningPage;
