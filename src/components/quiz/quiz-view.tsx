"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { QuizQuestion, Submission, User } from '@/lib/types';
import { quizQuestions } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import Timer from './timer';
import { QUIZ_TIME_MINUTES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

type QuizViewProps = {
  user: User;
  onSubmit: (submission: Omit<Submission, 'id' | 'timestamp' | 'attempt'>) => void;
  isSubmitting?: boolean;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function QuizView({ user, onSubmit, isSubmitting = false }: QuizViewProps) {
  const { toast } = useToast();

  const shuffledQuestions = useMemo(() => shuffleArray(quizQuestions), []);

  const form = useForm({
    defaultValues: Object.fromEntries(shuffledQuestions.map((q) => [q.id, ''])),
  });

  const handleSubmit = form.handleSubmit((data) => {
    let score = 0;
    let incorrectCount = 0;

    shuffledQuestions.forEach(q => {
      const userAnswer = (data[q.id] || '').trim();
      if (!userAnswer) return;

      const { answer: correctAnswer } = q;
      let isCorrect = false;
      if (Array.isArray(correctAnswer)) {
        isCorrect = correctAnswer.some(a => a.toLowerCase() === userAnswer.toLowerCase());
      } else {
        isCorrect = correctAnswer.toLowerCase() === userAnswer.toLowerCase();
      }

      if (isCorrect) {
        score++;
      } else {
        incorrectCount++;
      }
    });

    const penalty = Math.floor(incorrectCount / 4) * 0.5;
    const finalScore = Math.max(0, score - penalty);

    onSubmit({
      user,
      answers: data,
      score,
      penalty,
      finalScore,
      totalQuestions: shuffledQuestions.length,
    });
  });

  const forceSubmit = useCallback((reason: string) => {
    toast({
      title: "Quiz Auto-Submitted",
      description: reason,
      variant: "destructive"
    });
    handleSubmit();
  }, [handleSubmit, toast]);

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        forceSubmit('You switched tabs. The quiz has been submitted.');
      }
    };
    const handleCopy = () => forceSubmit('Copying is not allowed.');
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
    };
  }, [forceSubmit]);

  return (
    <Card className="w-full max-w-3xl animate-slide-in-up">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Talent Tango Quiz</CardTitle>
                <CardDescription>Answer all questions and submit your responses.</CardDescription>
            </div>
            <Timer initialMinutes={QUIZ_TIME_MINUTES} onTimeUp={() => forceSubmit('Time is up!')} />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {shuffledQuestions.map((q, index) => (
              <div key={q.id} className="p-4 rounded-lg border-l-4 border-primary bg-card shadow-sm">
                <FormLabel className="font-bold text-md" dangerouslySetInnerHTML={{ __html: `${index + 1}. ${q.text}` }} />
                <div className="mt-4">
                  {q.type === 'mcq' && q.options ? (
                    <FormField
                      control={form.control}
                      name={q.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                              {q.options?.map((option) => (
                                <FormItem key={option} className="flex items-center space-x-3">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name={q.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            ))}
            <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Submit Answers'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
