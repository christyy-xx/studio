import { TimesheetTable } from "@/components/dashboard/timesheet-table";
import { timesheetEntries } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

export default function TimesheetsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheet Management</h1>
          <p className="text-muted-foreground">
            Review synced events from Google Calendar and manage your team's time.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Entry
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Calendar
            </Button>
        </div>
      </header>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Synced Events</CardTitle>
          <CardDescription>
            A log of tasks and their durations from your connected calendars.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimesheetTable entries={timesheetEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
