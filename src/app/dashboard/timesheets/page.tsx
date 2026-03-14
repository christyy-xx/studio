"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { TimesheetTable } from "@/components/dashboard/timesheet-table";
import type { TimesheetEntry, WebhookTimesheetEvent } from '@/lib/types';

export default function TimesheetsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const { toast } = useToast();

  const handleSyncCalendar = async () => {
    setIsLoading(true);
    setEntries([]);
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
      
      const responseText = await response.text();
      if (!responseText) {
          setEntries([]);
          toast({
              title: "No events found",
              description: "The webhook returned an empty response."
          });
          setIsLoading(false);
          return;
      }

      const responseData = JSON.parse(responseText);
      const events: WebhookTimesheetEvent[] = Array.isArray(responseData) 
        ? responseData 
        : responseData.data || responseData.Employees || responseData.Employee || responseData.employees || responseData.employee || [];
      
      if (!events || events.length === 0) {
        toast({
            title: "No events found",
            description: "The webhook returned an empty list of events.",
        });
        setEntries([]);
        setIsLoading(false);
        return;
      }

      const formattedEntries: TimesheetEntry[] = events.map((event, index) => {
        return {
          id: String(index + 1),
          date: event['Date']?.trim() || 'N/A',
          eventTitle: event['Event Title'] || 'Unnamed Task',
          startTime: event['Start Time']?.trim() || 'N/A',
          endTime: event['End Time']?.trim() || 'N/A',
        };
      }).filter(entry => entry.date !== 'N/A');
      
      setEntries(formattedEntries);

      toast({
        title: "Success!",
        description: "Calendar sync completed successfully.",
      });

    } catch (error: any) {
      console.error(error);
      let description = 'Could not trigger webhook. Please try again.';
      if (error instanceof SyntaxError) {
        description = 'Received an invalid response from the webhook. Please check the webhook output format.'
      } else if (error.message.includes('fetch failed')) {
        description = "Connection to the webhook failed. Please check your network connection and ensure the webhook service is available at the configured URL.";
      } else if (error.message.includes('404')) {
        description = 'The webhook returned a 404 Not Found error. Please check that the URL is correct and the webhook is active.';
      } else {
        description = error.message;
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
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheet Management</h1>
          <p className="text-muted-foreground">
            Review synced events from Google Calendar and manage your team's time.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={handleSyncCalendar} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Sync Calendar
            </Button>
        </div>
      </header>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Synced Events</CardTitle>
          <CardDescription>
            A log of events from your connected calendars.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <TimesheetTable entries={entries} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
