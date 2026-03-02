"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from 'lucide-react';

export default function InterviewsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRequestData = async () => {
    setIsLoading(true);
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

      await response.text();

      toast({
        title: "Request Sent!",
        description: "Successfully requested interview result data from the webhook.",
      });
    } catch (error) {
      console.error(error);
      let description = 'Could not trigger webhook. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
            description = 'The webhook returned a 404 Not Found error. Please check that the URL is correct and the webhook is active.'
        } else {
            description = error.message;
        }
      }
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
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
          Request the latest interview result data from your sources via webhook.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Trigger Data Fetch</CardTitle>
          <CardDescription>
            Click the button below to send a request to your n8n webhook. This can be used to trigger a workflow to fetch and process interview result data.
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
    </div>
  );
}
