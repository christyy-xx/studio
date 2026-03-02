import { GetDataButton } from "@/components/dashboard/get-data-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidatesPage() {
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
          <GetDataButton />
        </CardContent>
      </Card>
    </div>
  );
}
