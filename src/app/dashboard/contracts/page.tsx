"use client";

import { useState } from 'react';
import type { WebhookContract } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send } from 'lucide-react';

// Sub-component for displaying data, kept in the same file to avoid creating new files.
function ContractDataTable({ data }: { data: WebhookContract[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No data received yet. Click "Get Data" to fetch from the webhook.</p>
      </div>
    );
  }

  const getStatusVariant = (status: any): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (String(status ?? '').toLowerCase()) {
      case 'sent for signature':
        return 'secondary';
      case 'signed':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((contract, index) => (
            <TableRow key={index}>
              <TableCell>
                <span className="font-medium">{contract['Candidate Name']}</span>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(contract['Status'])}>
                  {String(contract['Status'] ?? 'N/A')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


export default function ContractsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<WebhookContract[]>([]);
  const { toast } = useToast();

  const handleRequestData = async () => {
    setIsLoading(true);
    setContracts([]);
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'get-contract-data-trigger' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Webhook request failed.');
      }

      const responseText = await response.text();
      if (!responseText) {
          setContracts([]);
          toast({
              title: "No data returned",
              description: "The webhook returned an empty response."
          });
          setIsLoading(false);
          return;
      }
      
      const responseData = JSON.parse(responseText);
      const contractData: WebhookContract[] = responseData.Candidates || [];

      if (!contractData || contractData.length === 0) {
        toast({
            title: "No data returned",
            description: "The webhook returned an empty list of contracts.",
        });
        setContracts([]);
        setIsLoading(false);
        return;
      }
      
      setContracts(contractData);

      toast({
        title: "Data Received!",
        description: "Successfully fetched contract data from the webhook.",
      });
    } catch (error) {
      console.error(error);
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
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Contract Data</h1>
        <p className="text-muted-foreground">
          Request the latest contract data from your sources via webhook.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Trigger Data Fetch</CardTitle>
          <CardDescription>
            Click the button below to send a request to your webhook to fetch contract data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRequestData} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Get Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Received Contract Data</CardTitle>
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
            <ContractDataTable data={contracts} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
