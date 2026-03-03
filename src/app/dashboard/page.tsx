import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to HRAi Dashboard</h1>
        <p className="text-muted-foreground">Here's a quick overview of your HR activities.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump right into your most common tasks.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/dashboard/job-posting">
              New Job Post
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Link href="/dashboard/candidates">
            <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold">Manage Candidates</h3>
              <p className="text-sm text-muted-foreground">View, filter, and sort all applicants.</p>
            </div>
          </Link>
          <Link href="/dashboard/contracts">
          <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 transition-colors">
            <h3 className="font-semibold">View Contract Data</h3>
            <p className="text-sm text-muted-foreground">Fetch contract data from your sources.</p>
          </div>
          </Link>
          <Link href="/dashboard/interviews">
          <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 transition-colors">
            <h3 className="font-semibold">Review Interviews</h3>
            <p className="text-sm text-muted-foreground">Check AI-powered interview summaries and scores.</p>
          </div>
          </Link>
          <Link href="/dashboard/timesheets">
          <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 transition-colors">
            <h3 className="font-semibold">View Timesheets</h3>
            <p className="text-sm text-muted-foreground">Sync and review team timesheets.</p>
          </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
