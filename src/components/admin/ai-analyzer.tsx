"use client";

import { useState } from 'react';
import { adminAnalyzesOpenEndedAnswer } from '@/ai/flows/admin-analyzes-open-ended-answer';
import type { AnalyzeOpenEndedAnswerOutput } from '@/ai/flows/admin-analyzes-open-ended-answer';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AiAnalyzerProps = {
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
};

export default function AiAnalyzer({ questionText, studentAnswer, correctAnswer }: AiAnalyzerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeOpenEndedAnswerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await adminAnalyzesOpenEndedAnswer({
        questionText,
        studentAnswer,
        correctAnswer,
      });
      setResult(res);
    } catch (e) {
      setError('Failed to get analysis from AI. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <Button onClick={handleAnalysis} disabled={loading} size="sm" variant="outline">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Analyze with AI
      </Button>

      {error && (
         <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert className="mt-4" variant={result.isCorrect ? 'default' : 'destructive'}>
            {result.isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <AlertTitle className="font-bold">
            AI Analysis: {result.isCorrect ? "Correct" : "Incorrect"}
          </AlertTitle>
          <AlertDescription>
            {result.feedback}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
