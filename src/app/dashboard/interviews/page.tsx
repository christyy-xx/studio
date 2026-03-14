"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from 'lucide-react';
import type { Interview, WebhookInterviewResult } from '@/lib/types';
import { InterviewCard } from '@/components/dashboard/interview-card';

export default function InterviewsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { toast } = useToast();

  const handleRequestData = async () => {
    setIsLoading(true);
    setInterviews([]);
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'get-interview-data-trigger' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Webhook request failed.');
      }

      const responseText = await response.text();
      if (!responseText) {
        setInterviews([]);
        toast({
            title: "No data returned",
            description: "The webhook returned an empty response.",
        });
        setIsLoading(false);
        return;
      }
      
      const responseData = JSON.parse(responseText);
      
      let candidates: WebhookInterviewResult[] = [];
      if (Array.isArray(responseData)) {
        candidates = responseData;
      } else if (typeof responseData === 'object' && responseData !== null) {
        const arrayValue = Object.values(responseData).find(value => Array.isArray(value));
        if (arrayValue) {
            candidates = arrayValue as WebhookInterviewResult[];
        }
      }

      if (!candidates || candidates.length === 0) {
        toast({
            title: "No data returned",
            description: "The webhook returned an empty list of candidates.",
        });
        setInterviews([]);
        setIsLoading(false);
        return;
      }
      
      const formattedInterviews: Interview[] = candidates.map((candidate, index) => ({
        id: String(index + 1),
        candidateName: candidate['Candidate Name'],
        status: 'Completed', // Assuming all results are for completed interviews
        performanceScore: candidate['Fit Score'],
        communicationScore: candidate['Communication Score'],
        summary: candidate['Summary'],
      }));
      
      setInterviews(formattedInterviews);

      toast({
        title: "Data Received!",
        description: "Successfully fetched interview result data from the webhook.",
      });
    } catch (error) {
      console.error(error);
      let description = 'Could not trigger webhook. Please try again.';
      if (error instanceof SyntaxError) {
          description = "Received an invalid response from the webhook. Please check the webhook's output format.";
      } else if (error instanceof Error) {
        if (error.message.includes('fetch failed')) {
            description = "Connection to the webhook failed. Please check your network connection and ensure the webhook service is available at the configured URL.";
        } else if (error.message.includes('404')) {
            description = 'The webhook returned a 404 Not Found error. Please check that the URL is correct and the webhook is active.'
        } else {
            description = error.message;
        }
      }
      toast({
        variant: 'destructive',
        title: 'Webhook Connection Error',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Results</h1>
        <p className="text-muted-foreground">
          Review AI-powered summaries and performance scores for candidate interviews.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Trigger Data Fetch</CardTitle>
          <CardDescription>
            Click the button below to send a request to your n8n webhook to fetch and process interview result data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRequestData} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Request Data
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {interviews.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
