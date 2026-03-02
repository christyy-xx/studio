"use client";

import { useState } from 'react';
import { GetDataButton } from "@/components/dashboard/get-data-button";
import { WebhookDataTable } from "@/components/dashboard/webhook-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import type { WebhookCandidate } from '@/lib/types';

export default function CandidatesPage() {
  const [data, setData] = useState<WebhookCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Data</h1>
        <p className="text-muted-foreground">
          Request the latest candidate data from your sources via webhook.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Trigger Data Fetch</CardTitle>
          <CardDescription>
            Click the button below to send a request to your n8n webhook. This can be used to trigger a workflow to fetch and process candidate data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GetDataButton onDataReceived={setData} setIsLoading={setIsLoading} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Received Data</CardTitle>
          <CardDescription>
            The data received from the webhook will be displayed below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <WebhookDataTable data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
