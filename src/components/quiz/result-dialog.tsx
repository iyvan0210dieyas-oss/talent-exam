"use client";

import type { Submission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Award, Meh, Frown } from 'lucide-react';

type ResultDialogProps = {
  isOpen: boolean;
  result: Submission | null;
  onClose: () => void;
};

export default function ResultDialog({ isOpen, result, onClose }: ResultDialogProps) {
  if (!result) return null;

  const percentage = (result.finalScore / result.totalQuestions) * 100;
  let message = '';
  let Icon = Meh;

  if (percentage >= 80) {
    message = 'Excellent! You are a Puzzle Master!';
    Icon = Award;
  } else if (percentage >= 50) {
    message = 'Well done! You qualified.';
    Icon = Award;
  } else {
    message = 'Good effort! Keep practicing to improve your skills.';
    Icon = Frown;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-slide-in-up text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl mx-auto">🎉 Quiz Completed! 🎉</DialogTitle>
          <DialogDescription className="mx-auto">Great effort! Here are your results:</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center my-4">
          <p className="text-5xl font-extrabold text-primary">
            {result.finalScore} / {result.totalQuestions}
          </p>
          <div className="flex items-center gap-2 mt-4 text-lg text-muted-foreground">
            <Icon className={percentage >= 50 ? "text-green-500" : "text-red-500"}/>
            <p>{message}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Go to Home</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
