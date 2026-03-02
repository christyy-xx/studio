import { ContractGenerator } from "@/components/dashboard/contract-generator";
import { getCandidatesFromSheet } from "@/lib/sheets";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Candidate } from "@/lib/types";

export default async function ContractsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Contract Generation</h1>
        <p className="text-muted-foreground">
          Dynamically create personalized employment contracts using AI.
        </p>
      </header>

      {fetchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Candidate Data</AlertTitle>
          <AlertDescription>
            Could not load the list of candidates. {fetchError}
          </AlertDescription>
        </Alert>
      )}

      <div className="animate-fade-in">
        <ContractGenerator candidates={candidates} />
      </div>
    </div>
  );
}
