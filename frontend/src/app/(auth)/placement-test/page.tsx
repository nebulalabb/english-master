'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

interface Question {
  id: string;
  questionText: string;
  optionsJson: string[];
}

export default function PlacementTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ level: string; score: number } | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/placement-test/questions');
        setQuestions(response.data);
      } catch (error) {
        toast.error('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (!currentAnswer) return;

    const newAnswers = [...answers, { questionId: questions[currentIndex].id, answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: { questionId: string; answer: string }[]) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/placement-test/submit', { answers: finalAnswers });
      setResult(response.data);
      toast.success('Test submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading questions...</div>;
  }

  if (result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Test Results</CardTitle>
            <CardDescription>Your English level has been determined</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="py-8">
              <span className="text-sm font-medium uppercase text-muted-foreground tracking-wider">Your Level</span>
              <h2 className="text-5xl font-black text-primary mt-2">{result.level}</h2>
              <p className="mt-4 text-muted-foreground">You scored {Math.round(result.score)}% in the initial assessment.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={() => router.push('/')}>Start Learning Now</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-2xl mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="leading-relaxed">{currentQuestion.questionText}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={(val: string) => setCurrentAnswer(val)} value={currentAnswer || ''}>
            <div className="space-y-3">
              {currentQuestion.optionsJson.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option} id={`q-${index}`} />
                  <Label htmlFor={`q-${index}`} className="flex-1 cursor-pointer py-1">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <p className="text-sm text-muted-foreground italic">Take your time. There is no time limit.</p>
          <Button 
            size="lg" 
            disabled={!currentAnswer || isSubmitting} 
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1 ? (isSubmitting ? 'Submitting...' : 'Finish') : 'Next Question'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
