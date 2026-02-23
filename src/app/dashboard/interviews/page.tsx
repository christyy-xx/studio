import { InterviewCard } from "@/components/dashboard/interview-card";
import { interviews } from "@/lib/data";

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Results</h1>
        <p className="text-muted-foreground">
          Review AI-powered summaries and performance scores for candidate interviews.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </div>
  );
}
