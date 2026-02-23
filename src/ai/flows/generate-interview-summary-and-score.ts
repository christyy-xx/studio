'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate a concise feedback summary
 * and a numerical performance score from an interview transcript.
 *
 * - generateInterviewSummaryAndScore - A function that processes an interview transcript to produce a summary and score.
 * - GenerateInterviewSummaryAndScoreInput - The input type for the generateInterviewSummaryAndScore function.
 * - GenerateInterviewSummaryAndScoreOutput - The return type for the generateInterviewSummaryAndScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateInterviewSummaryAndScoreInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the AI interview.'),
});
export type GenerateInterviewSummaryAndScoreInput = z.infer<typeof GenerateInterviewSummaryAndScoreInputSchema>;

const GenerateInterviewSummaryAndScoreOutputSchema = z.object({
  summary: z.string().describe('A concise feedback summary of the candidate\'s performance in the interview.'),
  performanceScore: z.number().int().min(0).max(100).describe('A numerical performance score for the candidate, out of 100.'),
});
export type GenerateInterviewSummaryAndScoreOutput = z.infer<typeof GenerateInterviewSummaryAndScoreOutputSchema>;

export async function generateInterviewSummaryAndScore(
  input: GenerateInterviewSummaryAndScoreInput
): Promise<GenerateInterviewSummaryAndScoreOutput> {
  return generateInterviewSummaryAndScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewSummaryAndScorePrompt',
  input: { schema: GenerateInterviewSummaryAndScoreInputSchema },
  output: { schema: GenerateInterviewSummaryAndScoreOutputSchema },
  prompt: `You are an HR assistant tasked with analyzing an interview transcript and generating a concise feedback summary and a performance score for the candidate.
The performance score should be an integer between 0 and 100, where 100 is excellent.
Focus on the candidate's suitability for the role, communication skills, and demonstration of required competencies.

Interview Transcript:
{{{transcript}}}`,
});

const generateInterviewSummaryAndScoreFlow = ai.defineFlow(
  {
    name: 'generateInterviewSummaryAndScoreFlow',
    inputSchema: GenerateInterviewSummaryAndScoreInputSchema,
    outputSchema: GenerateInterviewSummaryAndScoreOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    return response.output!;
  }
);
