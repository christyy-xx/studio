import { CandidatesTable } from "@/components/dashboard/candidates-table";
import { getCandidatesFromSheet } from "@/lib/sheets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Terminal } from "lucide-react";
import type { Candidate } from "@/lib/types";

export default async function CandidatesPage() {
  let candidates: Candidate[] = [];
  let fetchError: string | null = null;
  
  try {
    candidates = await getCandidatesFromSheet();
  } catch(e: any) {
    fetchError = e.message || 'An unknown error occurred while fetching from Google Sheets.';
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Management</h1>
        <p className="text-muted-foreground">
          View, filter, and manage all your candidates in one place.
        </p>
      </header>

      {fetchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Data from Google Sheets</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{fetchError}</p>
            <div className="text-xs font-mono bg-muted/50 p-2 rounded">
              <b>Troubleshooting Tips:</b>
              <ul className="list-disc list-inside mt-1">
                <li>Ensure `.env` contains the correct `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`. Note: this is different from an OAuth Client ID/Secret.</li>
                <li>Make sure you have shared your Google Sheet with the service account email.</li>
                <li>Verify the spreadsheet ID and sheet name in `src/lib/sheets.ts`.</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {candidates.length === 0 && !fetchError && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Candidates Found</AlertTitle>
          <AlertDescription>
            Your connection to Google Sheets seems to be working, but no candidate data was found. Please make sure your sheet has data and is formatted correctly.
          </AlertDescription>
        </Alert>
      )}

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>
            A list of all candidates from your Google Sheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidatesTable candidates={candidates} />
        </CardContent>
      </Card>
    </div>
  );
}
