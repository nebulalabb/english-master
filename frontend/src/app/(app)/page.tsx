'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, MessageSquare, Headphones, Mic, PenTool, Book,
  TrendingUp, Award, Calendar, ChevronRight, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const DashboardPage = () => {
  const skills = [
    { name: 'Từ vựng', path: '/vocabulary', icon: Book, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Học từ qua Flashcard' },
    { name: 'Ngữ pháp', path: '/grammar', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Lý thuyết & Bài tập' },
    { name: 'Nghe', path: '/listening', icon: Headphones, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Luyện nghe audio' },
    { name: 'Nói', path: '/speaking', icon: Mic, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Chấm điểm phát âm' },
    { name: 'Đọc', path: '/reading', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-500/10', desc: 'Đọc hiểu & Tra từ' },
    { name: 'Viết', path: '/writing', icon: PenTool, color: 'text-cyan-500', bg: 'bg-cyan-500/10', desc: 'Chấm điểm bằng AI' },
  ];

  const stats = [
    { label: 'Điểm tích lũy', value: '150 XP', icon: Award, color: 'text-yellow-500' },
    { label: 'Chuỗi học tập', value: '5 Ngày', icon: Calendar, color: 'text-orange-500' },
    { label: 'Trình độ hiện tại', value: 'B1 Intermediate', icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="space-y-10 pb-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Chào mừng quay lại, <span className="text-primary italic">Học viên!</span></h1>
        <p className="text-muted-foreground text-lg italic">Hôm nay là một ngày tuyệt vời để nâng tầm tiếng Anh của bạn.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-[2rem] border-none shadow-xl bg-card overflow-hidden group">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={`h-14 w-14 rounded-2xl ${stat.color.replace('text', 'bg')}/10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                   <stat.icon className="h-7 w-7" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</p>
                   <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Focus: Six Skills */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black flex items-center gap-2">
              <Play className="h-6 w-6 text-primary fill-current" /> Tiếp tục luyện tập
           </h2>
           <Button variant="ghost" className="rounded-full font-bold gap-2">Tất cả bài học <ChevronRight className="h-4 w-4" /></Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {skills.map((skill, i) => (
             <motion.div
               key={skill.name}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 + 0.3 }}
             >
                <Link href={skill.path}>
                   <Card className="group h-full rounded-[2.5rem] border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer bg-card overflow-hidden">
                      <CardContent className="p-8 flex items-center gap-6">
                         <div className={`h-16 w-16 rounded-[1.5rem] ${skill.bg} flex items-center justify-center ${skill.color} group-hover:rotate-12 transition-all shadow-lg`}>
                            <skill.icon className="h-8 w-8" />
                         </div>
                         <div className="flex-1">
                            <h3 className="text-xl font-black group-hover:text-primary transition-colors">{skill.name}</h3>
                            <p className="text-xs font-medium text-muted-foreground italic mt-1">{skill.desc}</p>
                            <div className="mt-4 space-y-1.5">
                               <div className="flex justify-between text-[10px] font-black uppercase opacity-40">
                                  <span>Tiến độ</span>
                                  <span>{Math.floor(Math.random() * 100)}%</span>
                               </div>
                               <Progress value={Math.floor(Math.random() * 100)} className="h-1.5 rounded-full bg-primary/5" />
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </Link>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Recent Activity / Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="rounded-[3rem] border-none shadow-2xl bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black">Gợi ý hôm nay</CardTitle>
               <CardDescription>Dựa trên lỗ hổng kiến thức của bạn</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
               {[1,2].map(i => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                       <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-sm">Câu điều kiện loại 1</h4>
                       <p className="text-[10px] font-medium text-muted-foreground">Grammar • Intermediate</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                 </div>
               ))}
            </CardContent>
         </Card>

         <Card className="rounded-[3rem] border-none shadow-2xl bg-card overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black">Mục tiêu hàng tuần</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-sm font-bold">Học 50 từ mới</span>
                     <span className="text-xs font-black text-primary">32/50</span>
                  </div>
                  <Progress value={64} className="h-3 rounded-full bg-primary/10" />
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-sm font-bold">Hoàn thành 3 bài nghe</span>
                     <span className="text-xs font-black text-primary">1/3</span>
                  </div>
                  <Progress value={33} className="h-3 rounded-full bg-primary/10" />
               </div>
            </CardContent>
         </Card>
      </section>
    </div>
  );
};

// Fix for missing GraduationCap if not imported correctly
const GraduationCap = ({...props}) => <BookOpen {...props} />;

export default DashboardPage;
