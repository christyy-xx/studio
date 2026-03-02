"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

export function GetDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'get-data-trigger' }),
      });

      let responseMessage = "Webhook triggered successfully.";
      let responseTitle = "Webhook Request Sent!";
      
      try {
        const responseData = await response.json();
        responseMessage = JSON.stringify(responseData, null, 2);
      } catch (e) {
        const textResponse = await response.text();
        if (textResponse) {
          responseMessage = textResponse;
        }
      }

      if (!response.ok) {
        throw new Error(responseMessage);
      }

      toast({
        title: responseTitle,
        description: <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4"><code className="text-white">{responseMessage}</code></pre>,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: (error instanceof Error) ? error.message : 'Could not trigger webhook. Please try again.',
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
