'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, ChevronRight, Hash, Bookmark, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

const ReadingPage = () => {
  const [passages, setPassages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPassages();
  }, [activeTab]);

  const fetchPassages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/reading/passages', {
        params: { topic: activeTab === 'ALL' ? undefined : activeTab }
      });
      setPassages(response.data);
    } catch (error) {
      console.error('Failed to fetch reading passages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPassages = passages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'History', label: 'Lịch sử' },
    { id: 'Science', label: 'Khoa học' },
    { id: 'Culture', label: 'Văn hóa' },
    { id: 'Business', label: 'Kinh doanh' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight tracking-tight">Thư Viện <span className="text-primary italic">Đọc</span></h1>
          <p className="text-muted-foreground italic text-lg">"Mở mang kiến thức, nâng tầm vốn từ qua từng trang viết."</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm nội dung..." 
            className="pl-10 rounded-2xl bg-card/50 border-border/40 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
         <div className="bg-card/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/40 inline-flex overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'}`}
              >
                {cat.label}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {loading ? (
            Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-[2.5rem]" />)
         ) : filteredPassages.length > 0 ? (
            filteredPassages.map((passage, index) => (
               <motion.div
                 key={passage.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: index * 0.05 }}
               >
                  <Link href={`/reading/${passage.id}`}>
                     <Card className="group h-full rounded-[2.5rem] border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer bg-card overflow-hidden flex flex-col relative">
                        <div className="h-48 w-full bg-primary/5 relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
                           {passage.imageUrl ? (
                             <img src={passage.imageUrl} alt={passage.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center opacity-10">
                               <BookOpen className="h-32 w-32 text-primary" />
                             </div>
                           )}
                           <Badge className="absolute top-4 left-4 z-20 rounded-lg bg-card/80 backdrop-blur-md text-primary border-none font-black text-[10px] tracking-widest uppercase px-3 py-1">
                              {passage.topic}
                           </Badge>
                        </div>
                        
                        <CardHeader className="p-8 pb-4 relative z-20">
                           <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Level {passage.level}</span>
                              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase">
                                 <Clock className="h-3 w-3" /> {passage.durationMins} phút đọc
                              </div>
                           </div>
                           <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2">{passage.title}</CardTitle>
                        </CardHeader>
                        
                        <CardFooter className="p-8 pt-0 flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                              <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {passage._count.questions} câu hỏi</span>
                           </div>
                           <div className="h-10 w-10 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-xl group-hover:shadow-primary/40 font-black">
                              <ChevronRight className="h-5 w-5" />
                           </div>
                        </CardFooter>
                     </Card>
                  </Link>
               </motion.div>
            ))
         ) : (
            <div className="col-span-full py-20 text-center opacity-40 italic">Chưa có bài đọc trong mục này.</div>
         )}
      </div>
    </div>
  );
};

export default ReadingPage;
