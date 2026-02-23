import { CandidatesTable } from "@/components/dashboard/candidates-table";
import { candidates } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Management</h1>
        <p className="text-muted-foreground">
          View, filter, and manage all your candidates in one place.
        </p>
      </header>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>
            A list of all candidates in your pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidatesTable candidates={candidates} />
        </CardContent>
      </Card>
    </div>
  );
}
