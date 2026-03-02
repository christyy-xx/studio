import { CandidatesTable } from "@/components/dashboard/candidates-table";
import { getCandidatesFromSheet } from "@/lib/sheets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function CandidatesPage() {
  const candidates = await getCandidatesFromSheet();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Management</h1>
        <p className="text-muted-foreground">
          View, filter, and manage all your candidates in one place.
        </p>
      </header>
      {candidates.length === 0 && (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            To fetch data from Google Sheets, you need to set `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in your `.env` file. Make sure to also share your sheet with the service account email.
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
