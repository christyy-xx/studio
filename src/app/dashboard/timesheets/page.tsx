"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export default function TimesheetsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSyncCalendar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'sync-calendar-trigger' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Webhook request failed.');
      }

      toast({
        title: "Success!",
        description: "Calendar sync triggered successfully via webhook.",
      });

    } catch (error: any) {
      console.error(error);
      let description = 'Could not trigger webhook. Please try again.';
      if (error.message.includes('404')) {
        description = 'The webhook returned a 404 Not Found error. Please check that the URL is correct and the webhook is active.';
      } else {
        description = error.message;
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheet Management</h1>
          <p className="text-muted-foreground">
            Sync events from Google Calendar.
          </p>
        </div>
      </header>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Sync Calendar</CardTitle>
          <CardDescription>
            Click the button below to send a request to your n8n webhook to sync your calendar events.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleSyncCalendar} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Sync Calendar
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
