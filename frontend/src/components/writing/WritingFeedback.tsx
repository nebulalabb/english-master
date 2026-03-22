'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Target, BookOpen, Quote, RotateCcw, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface WritingFeedbackProps {
  result: any;
  onRetry: () => void;
}

const WritingFeedback: React.FC<WritingFeedbackProps> = ({ result, onRetry }) => {
  const chartData = [
    { subject: 'Ngữ pháp', A: result.breakdown.grammar, fullMark: 100 },
    { subject: 'Từ vựng', A: result.breakdown.vocabulary, fullMark: 100 },
    { subject: 'Mạch lạc', A: result.breakdown.coherence, fullMark: 100 },
    { subject: 'Nhiệm vụ', A: result.breakdown.taskAchievement, fullMark: 100 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <Card className="flex-1 rounded-[3rem] border-none shadow-2xl bg-gradient-to-br from-card to-background overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Award className="h-48 w-48 text-primary" />
          </div>
          <CardContent className="p-10 md:p-14 relative z-10 space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-40 w-40 rounded-[2.5rem] bg-primary flex flex-col items-center justify-center text-white shadow-2xl shadow-primary/40 relative">
                 <div className="text-6xl font-black">{result.overallScore}</div>
                 <div className="text-xs font-black uppercase tracking-widest opacity-60">Điểm tổng</div>
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center text-white shadow-lg"
                 >
                    <Award className="h-6 w-6" />
                 </motion.div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                 <h2 className="text-5xl font-black tracking-tighter">Bài viết của bạn</h2>
                 <p className="text-xl font-medium text-muted-foreground italic leading-relaxed">
                    "{result.overallScore >= 80 ? 'Một bài viết xuất sắc! Bạn đã làm chủ được ngôn ngữ và cấu trúc.' : result.overallScore >= 50 ? 'Khá tốt! Bạn đã truyền đạt được ý tưởng nhưng cần mài dũa thêm kỹ năng.' : 'Hãy tiếp tục cố gắng! Luyện tập là chìa khóa để tiến bộ.'}"
                 </p>
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 font-bold" onClick={onRetry}>
                       <RotateCcw className="h-4 w-4" /> Viết lại bài này
                    </Button>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 border-b border-border/40 pb-2">Ưu điểm</h3>
                  <ul className="space-y-4">
                     {result.feedback.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 bg-green-500/5 p-4 rounded-2xl border border-green-500/10 text-sm font-medium">
                           <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> {s}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 border-b border-border/40 pb-2">Cần cải thiện</h3>
                  <ul className="space-y-4">
                     {result.feedback.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="flex gap-3 bg-destructive/5 p-4 rounded-2xl border border-destructive/10 text-sm font-medium">
                           <XCircle className="h-5 w-5 text-destructive flex-shrink-0" /> {w}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-96 rounded-[3rem] border-none shadow-2xl bg-card overflow-hidden">
           <CardHeader className="p-10 pb-0">
              <CardTitle className="text-xl font-black text-center">Biểu đồ kỹ năng</CardTitle>
           </CardHeader>
           <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                       <PolarGrid stroke="#e2e8f0" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                       <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                       <Radar
                          name="Skills"
                          dataKey="A"
                          stroke="#E11D48"
                          fill="#E11D48"
                          fillOpacity={0.5}
                       />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
              
              <div className="w-full space-y-3 px-6 mt-4">
                 {chartData.map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-muted/30 p-3 rounded-xl">
                       <span className="text-xs font-bold text-muted-foreground">{d.subject}</span>
                       <span className="text-sm font-black text-primary">{d.A}%</span>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="rounded-[2.5rem] border-border/40 overflow-hidden bg-card">
            <CardHeader className="p-8 border-b border-border/40 flex flex-row items-center justify-between">
               <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" /> Bài viết mẫu 
               </CardTitle>
               <Badge className="bg-primary/10 text-primary border-none">Model Answer</Badge>
            </CardHeader>
            <CardContent className="p-8">
               <div className="text-lg leading-relaxed text-muted-foreground italic font-serif">
                  <Quote className="h-10 w-10 text-primary/10 mb-2" />
                  {result.modelAnswer}
               </div>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-border/40 overflow-hidden bg-white shadow-inner">
            <CardHeader className="p-8 border-b border-border/40">
               <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" /> Giải thích lỗi
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div 
                 className="prose prose-slate max-w-none text-lg leading-loose font-medium selection:bg-primary/20"
                 dangerouslySetInnerHTML={{ __html: result.annotatedContent }}
               />
               
               <div className="bg-muted p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                     <AlertCircle className="h-4 w-4" /> Gợi ý sửa lỗi
                  </h4>
                  <div className="space-y-3">
                     {result.feedback.suggestions.map((s: string, i: number) => (
                        <p key={i} className="text-sm font-medium flex gap-2">
                           <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {s}
                        </p>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default WritingFeedback;
