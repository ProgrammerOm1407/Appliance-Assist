// diagnose-issue.ts
'use server';
/**
 * @fileOverview An AI agent that diagnoses appliance issues based on user descriptions.
 *
 * - diagnoseIssue - A function that handles the issue diagnosis process.
 * - DiagnoseIssueInput - The input type for the diagnoseIssue function.
 * - DiagnoseIssueOutput - The return type for the diagnoseIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseIssueInputSchema = z.object({
  applianceType: z.string().describe('The type of appliance (e.g., fridge, washing machine, filter).'),
  issueDescription: z.string().describe('A detailed description of the issue the user is experiencing.'),
});
export type DiagnoseIssueInput = z.infer<typeof DiagnoseIssueInputSchema>;

const DiagnoseIssueOutputSchema = z.object({
  possibleCauses: z.array(z.string()).describe('A list of potential causes for the appliance malfunction.'),
  confidenceLevel: z.string().describe('A general indication of how confident the AI is in the diagnosis (e.g., high, medium, low).'),
});
export type DiagnoseIssueOutput = z.infer<typeof DiagnoseIssueOutputSchema>;

export async function diagnoseIssue(input: DiagnoseIssueInput): Promise<DiagnoseIssueOutput> {
  return diagnoseIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseIssuePrompt',
  input: {schema: DiagnoseIssueInputSchema},
  output: {schema: DiagnoseIssueOutputSchema},
  prompt: `You are an expert appliance repair technician. Based on the user's description of the issue and the type of appliance, provide a list of possible causes for the malfunction.

Appliance Type: {{{applianceType}}}
Issue Description: {{{issueDescription}}}

Respond with a list of possible causes and a general confidence level (high, medium, low). Format the response as a JSON object.`,
});

const diagnoseIssueFlow = ai.defineFlow(
  {
    name: 'diagnoseIssueFlow',
    inputSchema: DiagnoseIssueInputSchema,
    outputSchema: DiagnoseIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
