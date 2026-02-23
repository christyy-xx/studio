'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateStructuredJobPost, type GenerateStructuredJobPostOutput } from '@/ai/flows/generate-structured-job-post';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  rawJobDescription: z.string().min(50, {
    message: 'Job description must be at least 50 characters long.',
  }),
});

export function JobPostingForm() {
  const [result, setResult] = useState<GenerateStructuredJobPostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rawJobDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateStructuredJobPost({ rawJobDescription: values.rawJobDescription });
      setResult(output);
      toast({
        title: "Success!",
        description: "Structured job post generated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate job post. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Post</CardTitle>
          <CardDescription>Paste the raw text of a job description below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rawJobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raw Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., We're looking for a proactive Senior React Developer with 5+ years of experience in building modern web applications..."
                        className="min-h-[300px] lg:min-h-[400px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Structured Post
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Job Post</CardTitle>
          <CardDescription>The AI-structured output will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result ? (
            <div className="space-y-6 text-sm">
                <h2 className="text-2xl font-bold">{result.jobTitle}</h2>
                <p className="font-semibold text-muted-foreground">{result.companyName} - {result.location}</p>
                
                <div>
                    <h3 className="font-semibold text-lg mb-2">Job Summary</h3>
                    <p className="text-muted-foreground">{result.jobSummary}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Qualifications</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                {result.preferredQualifications && result.preferredQualifications.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Preferred Qualifications</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {result.preferredQualifications.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                )}
                {result.benefits && result.benefits.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.benefits.map((item, i) => <Badge variant="secondary" key={i}>{item}</Badge>)}
                        </div>
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-lg mb-2">How to Apply</h3>
                    <p className="text-muted-foreground">{result.applicationInstructions}</p>
                </div>
            </div>
          ) : (
            !isLoading && (
              <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Output will be displayed here</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
