"use client";

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import type { WebhookCandidate } from '@/lib/types';

interface GetDataButtonProps {
  onDataReceived: (data: WebhookCandidate[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export function GetDataButton({ onDataReceived, setIsLoading, isLoading }: GetDataButtonProps) {
  const { toast } = useToast();

  const handleGetData = async () => {
    setIsLoading(true);
    onDataReceived([]); // Clear previous data
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'get-data-trigger' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Webhook request failed.');
      }
      
      const responseText = await response.text();
      if (!responseText) {
          onDataReceived([]);
          toast({
              title: "No data returned",
              description: "The webhook returned an empty response."
          });
          setIsLoading(false);
          return;
      }
      
      const responseData = JSON.parse(responseText);
      const candidates = responseData.Candidates || [];
      onDataReceived(candidates);

      toast({
        title: "Data Received!",
        description: "Successfully fetched data from the webhook.",
      });
    } catch (error) {
      console.error(error);
      onDataReceived([]); // Clear data on error
      let description = 'Could not trigger webhook. Please try again.';
      if (error instanceof SyntaxError) {
          description = "Received an invalid response from the webhook. Please check the webhook's output format.";
      } else if (error instanceof Error) {
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
    <Button onClick={handleGetData} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Get Data
    </Button>
  );
}
