import type { Interview } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusColors: { [key in Interview['status']]: 'default' | 'secondary' | 'destructive' } = {
  'Completed': 'default',
  'Scheduled': 'secondary',
  'Canceled': 'destructive',
};

export function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="grid gap-1">
          <CardTitle>{interview.candidateName}</CardTitle>
          <CardDescription>
            <Badge variant={statusColors[interview.status]}>{interview.status}</Badge>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 grid gap-4">
        {interview.status === 'Completed' ? (
          <>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Fit Score</h4>
                <div className="flex items-center gap-2">
                  <Progress value={interview.performanceScore} className="w-full" />
                  <span className="font-semibold">{interview.performanceScore}%</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Technical Score</h4>
                <div className="flex items-center gap-2">
                  <Progress value={interview.technicalScore} className="w-full" />
                  <span className="font-semibold">{interview.technicalScore}%</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Communication Score</h4>
                <div className="flex items-center gap-2">
                  <Progress value={interview.communicationScore} className="w-full" />
                  <span className="font-semibold">{interview.communicationScore}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Feedback Summary</h4>
              <p className="text-sm text-muted-foreground">
                {interview.summary}
              </p>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">{interview.summary}</div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Interview ID: {interview.id}</p>
      </CardFooter>
    </Card>
  );
}
