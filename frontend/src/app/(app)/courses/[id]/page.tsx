'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  PlayCircle, 
  CheckCircle2, 
  Award, 
  BarChart3,
  Calendar,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`/courses/${id}`),
        axios.get(`/courses/${id}/progress`).catch(() => ({ data: null }))
      ]);
      setCourse(courseRes.data);
      setProgress(progressRes.data);
      
      // Expand the first unit by default
      if (courseRes.data.units?.[0]) {
        setExpandedUnits([courseRes.data.units[0].id]);
      }
    } catch (error: any) {
      console.error('Failed to fetch course:', error);
      if (error.response?.status === 404) {
        toast.error('Course not found');
        router.push('/courses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await axios.post(`/courses/${id}/enroll`);
      toast.success('Successfully enrolled!');
      fetchCourseData();
    } catch (error) {
      toast.error('Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId) 
        : [...prev, unitId]
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-12 px-4 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full md:w-80 rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      </div>
    );
  }

  const isEnrolled = !!progress;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative border-b bg-muted/30 pb-16 pt-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {course.category}
                </Badge>
                <Badge variant="secondary" className="font-semibold">
                  {course.level}
                </Badge>
                {course.isFree && <Badge variant="default" className="bg-green-600">Miễn phí</Badge>}
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
                {course.title}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {course.description || "Làm chủ tiếng Anh với lộ trình học bài bản giúp bạn tiến bộ từ con số 0 đến chuyên gia."}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span>{course.units?.length || 0} Chương</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>Khoảng 10 giờ học</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <span>Chứng chỉ hoàn thành</span>
                </div>
              </div>

              {!isEnrolled ? (
                <Button 
                  size="xl" 
                  className="px-10 h-14 text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                  Đăng ký khóa học
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="xl" 
                    className="px-10 h-14 text-lg font-bold shadow-lg shadow-primary/25"
                    onClick={() => toast.success('Đang chuyển đến bài học tiếp theo...')}
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Tiếp tục học
                  </Button>
                  <div className="flex flex-col justify-center">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      <span>Tiến độ khóa học</span>
                      <span>{Math.round(progress.progressPercent)}%</span>
                    </div>
                    <Progress value={progress.progressPercent} className="w-full sm:w-48 h-2 bg-primary/20" />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="overflow-hidden border-none bg-background/50 backdrop-blur-xl shadow-2xl">
                <div className="aspect-video w-full bg-muted relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Nội dung bạn sẽ học
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        Cải thiện vốn từ vựng theo ngữ cảnh
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        Bài tập luyện nói thực tế
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        Ngữ pháp cốt lõi cho đời sống
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Nội dung khóa học</h2>
              <span className="text-sm font-medium text-muted-foreground">{course.units?.length || 0} Chương &bull; {course.units?.reduce((acc: any, u: any) => acc + (u.lessons?.length || 0), 0)} Bài học</span>
            </div>

            <div className="space-y-4">
              {course.units?.map((unit: any, index: number) => (
                <div 
                  key={unit.id}
                  className="group rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/30"
                >
                  <button 
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => toggleUnit(unit.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{unit.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{unit.description || "Tập trung vào các khái niệm cốt lõi và từ vựng."}</p>
                      </div>
                    </div>
                    {expandedUnits.includes(unit.id) ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </button>

                  <AnimatePresence>
                    {expandedUnits.includes(unit.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 border-t bg-muted/20">
                          <div className="pt-4 space-y-2">
                            {unit.lessons?.map((lesson: any) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-4 rounded-xl border bg-background/80 transition-colors hover:bg-muted/50 cursor-pointer group/lesson"
                                onClick={() => isEnrolled ? router.push(`/learn/${lesson.id}`) : toast.error('You must enroll first!')}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover/lesson:bg-primary/20 group-hover/lesson:text-primary transition-colors">
                                    {lesson.type === 'VOCABULARY' ? <BookOpen className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm">{lesson.title}</h4>
                                    <span className="text-xs text-muted-foreground">{lesson.durationMinutes} phút &bull; {lesson.type}</span>
                                  </div>
                                </div>
                                {!isEnrolled ? (
                                  <Lock className="h-4 w-4 text-muted-foreground/50" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/lesson:opacity-100 transition-opacity" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none bg-primary/5 p-6 space-y-6">
                <h3 className="text-lg font-bold">Tổng quan</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-primary/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      <span>Cấp độ</span>
                    </div>
                    <span className="font-bold">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-primary/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Thể loại</span>
                    </div>
                    <span className="font-bold">{course.category}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-primary/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Ngày ra mắt</span>
                    </div>
                    <span className="font-bold">Th3 2024</span>
                  </div>
                </div>
              </Card>

              {isEnrolled && (
                <Card className="p-6 space-y-4">
                  <h3 className="font-bold">Tiến độ tổng quát</h3>
                  <div className="flex items-center justify-between text-2xl font-black">
                    <span>{Math.round(progress.progressPercent)}%</span>
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <Progress value={progress.progressPercent} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Hoàn thành 80% các chương để mở khóa cấp độ nâng cao!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
