import { JobPostingForm } from '@/components/dashboard/job-posting-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function JobPostingPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Job Post Generator</h1>
        <p className="text-muted-foreground">
          Convert a raw job description into a structured and professional job post using AI.
        </p>
      </header>
      <div className="animate-fade-in">
        <JobPostingForm />
      </div>
    </div>
  );
}
