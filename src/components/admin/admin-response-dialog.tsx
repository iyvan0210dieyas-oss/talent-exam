"use client";

import type { Submission } from '@/lib/types';
import { quizQuestions } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import AiAnalyzer from './ai-analyzer';

type AdminResponseDialogProps = {
  submission: Submission;
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminResponseDialog({ submission, isOpen, onClose }: AdminResponseDialogProps) {
  if (!submission) return null;

  const getQuestionStatus = (questionId: string) => {
    const question = quizQuestions.find(q => q.id === questionId);
    const userAnswer = submission.answers[questionId];
    if (!question || userAnswer === undefined || userAnswer === '') return 'unanswered';
    
    const { answer } = question;
    if (Array.isArray(answer)) {
      return answer.some(a => a.toLowerCase() === userAnswer.toLowerCase()) ? 'correct' : 'wrong';
    }
    return answer.toLowerCase() === userAnswer.toLowerCase() ? 'correct' : 'wrong';
  };
  
  const correctCount = quizQuestions.filter(q => getQuestionStatus(q.id) === 'correct').length;
  const wrongCount = quizQuestions.filter(q => getQuestionStatus(q.id) === 'wrong').length;
  const unansweredCount = quizQuestions.length - correctCount - wrongCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Response Details: {submission.user.name}</DialogTitle>
          <DialogDescription>
            Course: {submission.user.course} | Final Score: {submission.finalScore}/{submission.totalQuestions}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 p-4 border rounded-lg bg-secondary/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <p><strong>Email:</strong> {submission.user.email}</p>
                <p><strong>Attempt:</strong> {submission.attempt}</p>
                <p><strong>Base Score:</strong> {submission.score}</p>
                <p><strong>Penalty:</strong> -{submission.penalty}</p>
            </div>
             <div className="mt-4 flex gap-4">
                <Badge variant="default" className="bg-green-600 hover:bg-green-600">{correctCount} Correct</Badge>
                <Badge variant="destructive">{wrongCount} Incorrect</Badge>
                <Badge variant="secondary">{unansweredCount} Unanswered</Badge>
            </div>
        </div>

        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-4">
            {quizQuestions.map((question, index) => {
              const userAnswer = submission.answers[question.id] || '';
              const status = getQuestionStatus(question.id);

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    status === 'correct' ? 'border-green-500 bg-green-50' : 
                    status === 'wrong' ? 'border-red-500 bg-red-50' : 
                    'border-gray-300 bg-gray-50'
                  }`}
                >
                  <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                    {status === 'correct' && <CheckCircle2 className="text-green-600" size={20}/>}
                    {status === 'wrong' && <XCircle className="text-red-600" size={20}/>}
                    {status === 'unanswered' && <HelpCircle className="text-gray-500" size={20}/>}
                    Question {index + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2" dangerouslySetInnerHTML={{ __html: question.text }} />
                  <p className="text-sm">
                    <strong>Your Answer:</strong>{' '}
                    <span className={status === 'wrong' ? 'text-red-700' : status === 'correct' ? 'text-green-800' : 'text-gray-600'}>
                      {userAnswer || 'Not Answered'}
                    </span>
                  </p>
                  {status === 'wrong' && (
                    <p className="text-sm mt-1">
                      <strong>Correct Answer:</strong>{' '}
                      <span className="text-green-800 font-medium">
                        {Array.isArray(question.answer) ? question.answer.join(' OR ') : question.answer}
                      </span>
                    </p>
                  )}

                  {question.aiEval && userAnswer && (
                    <AiAnalyzer 
                      questionText={question.text} 
                      studentAnswer={userAnswer}
                      correctAnswer={Array.isArray(question.answer) ? question.answer.join(' OR ') : question.answer}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
