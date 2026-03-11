"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type InstructionsDialogProps = {
  isOpen: boolean;
  onConfirm: () => void;
};

export default function InstructionsDialog({ isOpen, onConfirm }: InstructionsDialogProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(onConfirm, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onConfirm]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md animate-slide-in-up">
        <DialogHeader>
          <DialogTitle>Quiz Instructions</DialogTitle>
          <DialogDescription>Please read carefully before you begin.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>The test consists of 35 questions from Numerical Ability, Reasoning, and Verbal Ability.</p>
          <p>Each question carries 1 mark.</p>
          <p>A penalty of <strong>0.5 marks</strong> will be deducted for every 4 incorrect answers.</p>
          <p>A minimum of 50% marks is required to qualify.</p>
          <p className="font-bold text-foreground">All the best!</p>
        </div>
        <DialogFooter>
            <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Starting in {countdown}...
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
