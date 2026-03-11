'use server';
/**
 * @fileOverview An AI agent for analyzing open-ended student answers.
 *
 * - adminAnalyzesOpenEndedAnswer - A function that handles the analysis of open-ended quiz answers.
 * - AnalyzeOpenEndedAnswerInput - The input type for the adminAnalyzesOpenEndedAnswer function.
 * - AnalyzeOpenEndedAnswerOutput - The return type for the adminAnalyzesOpenEndedAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const AnalyzeOpenEndedAnswerInputSchema = z.object({
  questionText: z.string().describe('The full text of the open-ended question.'),
  studentAnswer: z.string().describe('The student\'s textual answer to the question.'),
  correctAnswer: z.string().describe('The official correct answer to the question. This might be a single answer or multiple possible answers separated by " OR ".'),
});
export type AnalyzeOpenEndedAnswerInput = z.infer<typeof AnalyzeOpenEndedAnswerInputSchema>;

// Output Schema
const AnalyzeOpenEndedAnswerOutputSchema = z.object({
  isCorrect: z.boolean().describe('True if the student\'s answer is correct, otherwise false. Consider partial correctness as incorrect unless it meets the primary criteria.'),
  feedback: z.string().describe('Constructive feedback explaining why the answer was marked correct or incorrect, and if incorrect, what the correct answer should have been.'),
});
export type AnalyzeOpenEndedAnswerOutput = z.infer<typeof AnalyzeOpenEndedAnswerOutputSchema>;

// Prompt definition
const analyzeOpenEndedAnswerPrompt = ai.definePrompt({
  name: 'analyzeOpenEndedAnswerPrompt',
  input: { schema: AnalyzeOpenEndedAnswerInputSchema },
  output: { schema: AnalyzeOpenEndedAnswerOutputSchema },
  prompt: `You are an expert quiz grader. Your task is to evaluate a student's open-ended answer against a provided correct answer.

Instructions:
1. Carefully read the "Question Text", "Student's Answer", and "Correct Answer".
2. Determine if the "Student's Answer" is conceptually correct and aligns with the "Correct Answer". Minor phrasing differences are acceptable if the core meaning is present. If the "Correct Answer" contains multiple options separated by " OR ", consider the student's answer correct if it matches any of these options.
3. Set the 'isCorrect' field to true if the student's answer is correct, and false otherwise.
4. Provide concise and constructive 'feedback'. If the answer is correct, confirm it. If incorrect, explain why and state the correct answer(s) explicitly.

---
Question Text: {{{questionText}}}
Student's Answer: {{{studentAnswer}}}
Correct Answer: {{{correctAnswer}}}
---`,
});

// Flow definition
const adminAnalyzesOpenEndedAnswerFlow = ai.defineFlow(
  {
    name: 'adminAnalyzesOpenEndedAnswerFlow',
    inputSchema: AnalyzeOpenEndedAnswerInputSchema,
    outputSchema: AnalyzeOpenEndedAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeOpenEndedAnswerPrompt(input);
    if (!output) {
      throw new Error('AI model did not return an output.');
    }
    return output;
  }
);

// Wrapper function
export async function adminAnalyzesOpenEndedAnswer(input: AnalyzeOpenEndedAnswerInput): Promise<AnalyzeOpenEndedAnswerOutput> {
  return adminAnalyzesOpenEndedAnswerFlow(input);
}
