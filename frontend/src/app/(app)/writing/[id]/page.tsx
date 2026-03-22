'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, PenTool, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import WritingEditor from '@/components/writing/WritingEditor';
import WritingFeedback from '@/components/writing/WritingFeedback';

const WritingDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/writing/prompts/${id}`);
      setPrompt(response.data);
    } catch (error) {
      console.error('Failed to fetch writing prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-10 w-48 rounded-full" />
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="col-span-2 h-[500px] rounded-[3rem]" />
          <Skeleton className="h-[500px] rounded-[3rem]" />
        </div>
     </div>
  );

  if (!prompt) return <div className="p-20 text-center italic">Không tìm thấy nội dung đề bài.</div>;

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      <div className="flex items-center justify-between">
         <Button variant="ghost" onClick={() => router.push('/writing')} className="rounded-full gap-2 transition-all hover:pl-2">
            <ChevronLeft className="h-5 w-5" /> Quay lại danh sách
         </Button>
         <div className="flex gap-2">
            <Badge className="rounded-full bg-primary/10 text-primary border-none px-4 py-1 font-black">
               {prompt.type.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 font-bold">
               {prompt.level}
            </Badge>
         </div>
      </div>

      <header className="space-y-4">
         <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
               <PenTool className="h-8 w-8" />
            </div>
            <div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight">{prompt.title}</h1>
               <div className="flex items-center gap-2 text-muted-foreground font-medium italic">
                  <span>{prompt.topic}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>Target: {prompt.targetWords} words</span>
               </div>
            </div>
         </div>
      </header>

      {!result ? (
        <WritingEditor prompt={prompt} onSuccess={setResult} />
      ) : (
        <div className="space-y-8">
           <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-3xl border border-primary/10 text-primary font-bold overflow-hidden shadow-inner">
              <Sparkles className="h-5 w-5 animate-pulse" /> AI đã phân tích và chấm điểm bài viết của bạn. Hãy xem chi tiết bên dưới!
           </div>
           <WritingFeedback result={result} onRetry={() => setResult(null)} />
        </div>
      )}
    </div>
  );
};

export default WritingDetailPage;
