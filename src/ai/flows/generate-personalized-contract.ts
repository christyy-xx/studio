'use server';
/**
 * @fileOverview A Genkit flow for generating personalized employment contracts.
 *
 * - generatePersonalizedContract - A function that handles the contract generation process.
 * - GeneratePersonalizedContractInput - The input type for the generatePersonalizedContract function.
 * - GeneratePersonalizedContractOutput - The return type for the generatePersonalizedContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GeneratePersonalizedContractInputSchema = z.object({
  candidateName: z.string().describe('The full name of the candidate.'),
  jobTitle: z.string().describe('The job title for the contract.'),
  salary: z.number().describe('The annual salary for the position.'),
  startDate: z.string().describe('The start date of employment in YYYY-MM-DD format.'),
  contractTemplate: z
    .string()
    .describe('A base employment contract template to be personalized.'),
  additionalClauses:
    z.string().optional().describe('Any additional specific clauses or terms to include in the contract.'),
});
export type GeneratePersonalizedContractInput = z.infer<
  typeof GeneratePersonalizedContractInputSchema
>;

const GeneratePersonalizedContractOutputSchema = z.object({
  contractContent: z.string().describe('The fully generated and personalized employment contract.'),
});
export type GeneratePersonalizedContractOutput = z.infer<
  typeof GeneratePersonalizedContractOutputSchema
>;

export async function generatePersonalizedContract(
  input: GeneratePersonalizedContractInput
): Promise<GeneratePersonalizedContractOutput> {
  return generatePersonalizedContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedContractPrompt',
  input: {schema: GeneratePersonalizedContractInputSchema},
  output: {schema: GeneratePersonalizedContractOutputSchema},
  prompt: `You are an HR contract generation assistant. Your task is to personalize a given employment contract template using the provided candidate details.

**Instructions:**
1.  Take the \`contractTemplate\` provided below.
2.  Replace placeholders or integrate the following candidate-specific information into the template:
    *   Candidate Name: {{{candidateName}}}
    *   Job Title: {{{jobTitle}}}
    *   Annual Salary: {{{salary}}}
    *   Start Date: {{{startDate}}}
3.  If \`additionalClauses\` are provided, integrate them naturally and appropriately into the contract, typically towards the end or in an 'Additional Terms' section.
4.  Ensure the generated contract is professional, legally sound (to the best of an AI's ability), and clearly formatted.
5.  Return the complete personalized contract.

---
**Candidate Details:**
Candidate Name: {{{candidateName}}}
Job Title: {{{jobTitle}}}
Annual Salary: {{{salary}}}
Start Date: {{{startDate}}}

**Additional Clauses (if any):**
{{{additionalClauses}}}

---
**Contract Template:**
{{{contractTemplate}}}`,
});

const generatePersonalizedContractFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedContractFlow',
    inputSchema: GeneratePersonalizedContractInputSchema,
    outputSchema: GeneratePersonalizedContractOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
