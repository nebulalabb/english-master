'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import CourseCard from '@/components/courses/CourseCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const levelParams = activeTab === 'all' ? '' : `?level=${activeTab}`;
      const response = await axios.get(`/courses${levelParams}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course: any) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Khám phá <span className="text-primary italic">Khóa học</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Làm chủ tiếng Anh với lộ trình học AI được thiết kế riêng cho bạn.
          </p>
        </div>
        
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              className="pl-10 h-12 bg-background/60 backdrop-blur-md border-primary/20 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 sm:w-[400px] h-11 bg-background/40 backdrop-blur-md border border-border/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">Tất cả</TabsTrigger>
            <TabsTrigger value="A1" className="data-[state=active]:bg-primary data-[state=active]:text-white">A1</TabsTrigger>
            <TabsTrigger value="B1" className="data-[state=active]:bg-primary data-[state=active]:text-white">B1</TabsTrigger>
            <TabsTrigger value="C1" className="data-[state=active]:bg-primary data-[state=active]:text-white">C1</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Tổng số: {filteredCourses.length}</span>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pb-12">
          {filteredCourses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Không tìm thấy khóa học</h2>
          <p className="text-muted-foreground">Thử thay đổi từ khóa hoặc bộ lọc.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
