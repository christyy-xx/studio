'use server';
/**
 * @fileOverview A Genkit flow for generating a structured job post from a raw job description.
 *
 * - generateStructuredJobPost - A function that handles the generation of a structured job post.
 * - GenerateStructuredJobPostInput - The input type for the generateStructuredJobPost function.
 * - GenerateStructuredJobPostOutput - The return type for the generateStructuredJobPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateStructuredJobPostInputSchema = z.object({
  rawJobDescription: z
    .string()
    .describe(
      'A raw job description provided by the HR manager, which needs to be structured.'
    ),
});
export type GenerateStructuredJobPostInput = z.infer<
  typeof GenerateStructuredJobPostInputSchema
>;

const GenerateStructuredJobPostOutputSchema = z.object({
  jobTitle: z.string().describe('The title of the job post.'),
  companyName: z.string().describe('The name of the company.'),
  location: z.string().describe('The location of the job.'),
  jobSummary: z
    .string()
    .describe('A brief summary or overview of the job role.'),
  responsibilities: z
    .array(z.string())
    .describe('A list of key responsibilities for the role.'),
  qualifications: z
    .array(z.string())
    .describe('A list of required qualifications for the role.'),
  preferredQualifications: z
    .array(z.string())
    .optional()
    .describe('A list of preferred but not strictly required qualifications.'),
  benefits: z
    .array(z.string())
    .optional()
    .describe('A list of benefits offered for the position.'),
  applicationInstructions: z
    .string()
    .describe('Instructions on how to apply for the position.'),
});
export type GenerateStructuredJobPostOutput = z.infer<
  typeof GenerateStructuredJobPostOutputSchema
>;

export async function generateStructuredJobPost(
  input: GenerateStructuredJobPostInput
): Promise<GenerateStructuredJobPostOutput> {
  return generateStructuredJobPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStructuredJobPostPrompt',
  input: {schema: GenerateStructuredJobPostInputSchema},
  output: {schema: GenerateStructuredJobPostOutputSchema},
  prompt: `You are an expert HR professional responsible for creating clear, concise, and professional job postings.

Take the following raw job description and transform it into a structured job post by extracting and categorizing the information into the specified JSON format.
Ensure all sections are populated based on the provided text, and if a section is not explicitly mentioned but can be inferred (like application instructions if not present, create a generic one), please do so. If preferred qualifications or benefits are not mentioned, they can be omitted.

Raw Job Description:
{{{rawJobDescription}}}`,
});

const generateStructuredJobPostFlow = ai.defineFlow(
  {
    name: 'generateStructuredJobPostFlow',
    inputSchema: GenerateStructuredJobPostInputSchema,
    outputSchema: GenerateStructuredJobPostOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    return response.output!;
  }
);
