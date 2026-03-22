'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, BookOpen, Repeat, LayoutGrid, Clock, Star, Volume2 } from 'lucide-react';
import axios from '@/lib/axios';
import ReviewSession from '@/components/vocabulary/ReviewSession';
import WordDetailModal from '@/components/vocabulary/WordDetailModal';
import { Skeleton } from '@/components/ui/skeleton';

const VocabularyPage = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [words, setWords] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [sets, setSets] = useState<any[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewWords, setReviewWords] = useState<any[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [topicsRes, setsRes, reviewRes] = await Promise.all([
        axios.get('/vocabulary/topics'),
        axios.get('/vocabulary/sets'),
        axios.get('/vocabulary/review')
      ]);
      setTopics(topicsRes.data);
      setSets(setsRes.data);
      setReviewCount(reviewRes.data.length);
      setReviewWords(reviewRes.data);
      
      // Initially fetch all words or from first topic
      const wordsRes = await axios.get('/vocabulary/words');
      setWords(wordsRes.data);
    } catch (error) {
      console.error('Failed to fetch vocabulary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get('/vocabulary/words', {
          params: {
            topic: selectedTopic || undefined,
            search: searchTerm || undefined
          }
        });
        setWords(response.data);
      } catch (error) {
        console.error('Failed to fetch words:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchWords();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedTopic, searchTerm]);

  const handleWordClick = (word: any) => {
    setSelectedWord(word);
    setIsWordModalOpen(true);
  };

  if (showReview) {
    return (
      <ReviewSession 
        words={reviewWords} 
        onComplete={() => {
          setShowReview(false);
          fetchInitialData();
        }}
        onClose={() => setShowReview(false)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Học từ vựng</h1>
          <p className="text-muted-foreground italic">Mở rộng vốn từ và làm chủ ngôn ngữ mỗi ngày.</p>
        </div>
        <Button className="rounded-full gap-2">
          <Plus className="h-4 w-4" /> Tạo bộ Flashcard
        </Button>
      </div>

      <Tabs defaultValue="topics" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 rounded-full h-12 p-1 bg-muted/50 border border-border/50">
          <TabsTrigger value="topics" className="rounded-full gap-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutGrid className="h-4 w-4" /> Chủ đề
          </TabsTrigger>
          <TabsTrigger value="sets" className="rounded-full gap-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BookOpen className="h-4 w-4" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="review" className="rounded-full gap-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm relative">
            <Repeat className="h-4 w-4" /> Ôn tập
            {reviewCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold border-2 border-background animate-pulse">
                {reviewCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="topics" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Tìm kiếm từ vựng..." 
                   className="pl-10 h-11 rounded-xl bg-card border-border/40 focus:ring-primary/20"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <Button 
                    variant={selectedTopic === null ? 'default' : 'outline'} 
                    className="rounded-full whitespace-nowrap"
                    onClick={() => setSelectedTopic(null)}
                  >
                    Tất cả
                  </Button>
                  {topics.map(topic => (
                    <Button 
                      key={topic} 
                      variant={selectedTopic === topic ? 'default' : 'outline'} 
                      className="rounded-full whitespace-nowrap capitalize"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic}
                    </Button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
               {loading ? (
                 Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
               ) : words.length > 0 ? (
                 words.map((word) => (
                   <Card 
                     key={word.id} 
                     className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group rounded-2xl overflow-hidden bg-card/50"
                     onClick={() => handleWordClick(word)}
                   >
                     <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {word.level}
                           </span>
                           <Volume2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <CardTitle className="text-xl font-bold mt-2">{word.word}</CardTitle>
                     </CardHeader>
                     <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-1">{word.definition}</p>
                     </CardContent>
                   </Card>
                 ))
               ) : (
                 <div className="col-span-full py-20 text-center space-y-4">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                       <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-muted-foreground italic">Không tìm thấy từ nào phù hợp...</p>
                 </div>
               )}
            </div>
          </TabsContent>

          <TabsContent value="sets" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sets.map((set) => (
                <Card key={set.id} className="group overflow-hidden rounded-2xl border-border/40 hover:shadow-xl transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md">
                         <Star className="h-4 w-4" />
                      </Button>
                   </div>
                   <CardHeader className="relative pb-2">
                     <CardTitle className="text-2xl font-black">{set.title}</CardTitle>
                     <CardDescription className="line-clamp-2">{set.description || 'Không có mô tả'}</CardDescription>
                   </CardHeader>
                   <CardContent className="flex items-center gap-4 text-sm text-muted-foreground italic">
                     <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" /> {set._count?.setWords || 0} từ
                     </div>
                     <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Mới cập nhật
                     </div>
                   </CardContent>
                   <CardFooter className="bg-muted/30 border-t border-border/20 p-4 gap-3">
                      <Button className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20">Học ngay</Button>
                      <Button variant="outline" className="rounded-xl px-3">Sửa</Button>
                   </CardFooter>
                </Card>
              ))}
              
              {/* Empty State / Create New */}
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center group hover:bg-muted/20 transition-all cursor-pointer rounded-2xl">
                 <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                 </div>
                 <h3 className="font-bold text-lg">Tạo bộ mới</h3>
                 <p className="text-sm text-muted-foreground">Nhóm các từ vựng lại để dễ dàng ghi nhớ.</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="review" className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="relative text-center space-y-6 max-w-lg">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
              
              <div className="space-y-2">
                <span className="text-primary font-black uppercase tracking-widest text-sm">Ôn tập hôm nay</span>
                <h2 className="text-5xl font-black tracking-tight">Hôm nay cần ôn <span className="text-primary italic underline decoration-wavy underline-offset-8">{reviewCount}</span> từ</h2>
                <p className="text-muted-foreground italic text-lg pt-4">"Lặp lại ngắt quãng (Spaced Repetition) là chìa khóa để kiến thức đi sâu vào trí nhớ dài hạn."</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-xl font-black rounded-full shadow-2xl shadow-primary/30 gap-3" 
                  disabled={reviewCount === 0}
                  onClick={() => setShowReview(true)}
                >
                  <Repeat className="h-6 w-6" /> Bắt đầu ngay
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-xl font-bold rounded-full group">
                  Luyện tập tự do <Search className="ml-2 h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 text-center">
                 <div>
                    <div className="text-2xl font-black text-primary">5</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Ngày liên tiếp</div>
                 </div>
                 <div className="w-px h-8 bg-border/50" />
                 <div>
                    <div className="text-2xl font-black text-primary">120</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Từ đã thuộc</div>
                 </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <WordDetailModal 
        word={selectedWord}
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        onAddToSet={(wordId) => {
          console.log('Add to set:', wordId);
          // TODO: Implement Add to Set modal/logic
        }}
      />
    </div>
  );
};

export default VocabularyPage;
