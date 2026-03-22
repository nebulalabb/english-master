'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    level: string;
    category: string;
    thumbnail: string | null;
    isFree: boolean;
    _count?: {
      units: number;
    };
    progressPercent?: number;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const isEnrolled = course.progressPercent !== undefined;

  return (
    <Card className="group relative overflow-hidden border-none bg-background/40 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/50 to-purple-500/50 opacity-0 blur transition duration-500 group-hover:opacity-30" />
      
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}
        
        <div className="absolute right-3 top-3 flex gap-2">
          <Badge variant={course.isFree ? "secondary" : "default"} className="bg-background/80 backdrop-blur-md">
            {course.isFree ? 'Free' : 'Premium'}
          </Badge>
          <Badge className="bg-primary/80 backdrop-blur-md text-white border-none">
            {course.level}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {course.category}
        </div>
        <CardTitle className="line-clamp-1 text-xl font-bold group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground h-10">
          {course.description || "Start your English learning journey with our comprehensive course designed for all levels."}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course._count?.units || 0} Units</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>~10h</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Your Progress</span>
              <span className="text-primary">{Math.round(course.progressPercent || 0)}%</span>
            </div>
            <Progress value={course.progressPercent} className="h-1.5" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button 
            className="w-full group/btn relative overflow-hidden transition-all duration-300"
            variant={isEnrolled ? "default" : "outline"}
          >
            {isEnrolled ? (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Continue Learning
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                View Course
              </>
            )}
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
