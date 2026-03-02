"use client";

import type { WebhookCandidate } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function WebhookDataTable({ data }: { data: WebhookCandidate[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No data received yet. Click "Get Data" to fetch from the webhook.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate Name</TableHead>
            <TableHead className="text-center">Fit Score</TableHead>
            <TableHead className="text-center">Shortlisted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((candidate, index) => (
            <TableRow key={index}>
              <TableCell>
                <span className="font-medium">{candidate['Candidate Name']}</span>
              </TableCell>
              <TableCell className="text-center">{candidate['Fit Score']}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">
                  {String(candidate['Shortlisted'])}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
