export type Candidate = {
  id: string;
  name: string;
  avatarUrl: string;
  resumeScore: number;
  status: 'Shortlisted' | 'Interviewing' | 'Offered' | 'Rejected' | 'Hired';
};

export type Interview = {
  id: string;
  candidateName: string;
  candidateAvatarUrl: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
  performanceScore: number;
  summary: string;
};

export type TimesheetEntry = {
  id: string;
  date: string;
  task: string;
  duration: string;
};

export type Notification = {
  id: string;
  type: 'email' | 'telegram' | 'system';
  message: string;
  time: string;
};

export type WebhookCandidate = {
  'Candidate Name': string;
  'Fit Score': number;
  'Shortlisted': string | boolean;
};

export type WebhookInterviewResult = {
  'Candidate Name': string;
  'Fit Score': number;
  'Technical Score': number;
  'Communication Score': number;
  'Summary': string;
};
