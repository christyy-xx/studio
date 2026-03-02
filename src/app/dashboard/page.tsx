import Link from "next/link";
import { ArrowUpRight, Users, Briefcase, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCandidatesFromSheet } from "@/lib/sheets";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";

export default async function DashboardPage() {
  const candidates = await getCandidatesFromSheet();
  const totalCandidates = candidates.length;
  const hiredCandidates = candidates.filter(c => c.status === 'Hired').length;
  const interviewingCandidates = candidates.filter(c => c.status === 'Interviewing').length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to HRAi Dashboard</h1>
        <p className="text-muted-foreground">Here's a quick overview of your HR activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{hiredCandidates}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Interviewing</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewingCandidates}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
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
              <h3 className="font-semibold">Generate Contract</h3>
              <p className="text-sm text-muted-foreground">Create a new employment contract for a candidate.</p>
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

        <NotificationsPanel />
      </div>
    </div>
  );
}
