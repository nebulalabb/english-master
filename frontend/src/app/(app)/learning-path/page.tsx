'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, PlayCircle, Star, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LearningPathPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/learning-path');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải lộ trình của bạn...</div>;

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">Hành trình <span className="text-primary italic">Học tập</span> của bạn</h1>
        <p className="text-lg text-muted-foreground italic">"Mỗi bước đi là một chặng đường tới làm chủ ngôn ngữ."</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Connection Path Line (SVG) */}
        <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-indigo-500 rounded-full opacity-20" />

        <div className="space-y-24 relative z-10 w-full">
          {courses.map((course, index) => (
            <div key={course.id} className={`flex w-full items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="flex-1 hidden md:block" />
              
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: index * 0.1 }}
                >
                  <Link href={`/courses/${course.id}`}>
                    <div className={`relative h-24 w-24 rounded-full p-1 border-4 shadow-xl transition-all hover:scale-110 active:scale-95 ${index === 0 ? 'border-primary bg-primary/20 shadow-primary/30' : 'border-muted-foreground/30 bg-muted/50'}`}>
                      <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                        {index === 0 ? (
                          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                        ) : null}
                        {index === 0 ? <PlayCircle className="h-10 w-10 text-primary" /> : <Lock className="h-8 w-8 text-muted-foreground/50" />}
                      </div>
                      
                      {/* Floating Rank/Level Tag */}
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        {course.level}
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <div className={`absolute top-28 whitespace-nowrap text-sm font-bold tracking-tight text-center ${index % 2 === 0 ? 'md:left-32' : 'md:right-32'}`}>
                  <h3 className="text-foreground">{course.title}</h3>
                  <div className="flex items-center gap-1 justify-center text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span>Nên học</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 hidden md:block" />
            </div>
          ))}

          {/* Bottom Achievement Node */}
          <div className="flex flex-col items-center pt-12">
            <div className="h-32 w-32 rounded-full border-4 border-dashed border-muted flex items-center justify-center opacity-50">
              <Award className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest italic">Làm chủ hoàn toàn</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-12">
        <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20" onClick={fetchPath}>
          Tải lại lộ trình
        </Button>
      </div>
    </div>
  );
};

export default LearningPathPage;
