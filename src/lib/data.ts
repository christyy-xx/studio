import type { Candidate, Interview, TimesheetEntry, Notification } from './types';

// Candidate data is now fetched from Google Sheets.
// The `candidates` export has been removed from this file.

export const interviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Aarav Sharma',
    status: 'Completed',
    performanceScore: 85,
    technicalScore: 90,
    communicationScore: 80,
    summary: 'Strong technical skills but needs to improve on situational questions. Good fit for the team culture.'
  },
  {
    id: '2',
    candidateName: 'Priya Patel',
    status: 'Scheduled',
    performanceScore: 0,
    technicalScore: 0,
    communicationScore: 0,
    summary: 'Interview scheduled for next week.'
  },
  {
    id: '3',
    candidateName: 'Rohan Gupta',
    status: 'Completed',
    performanceScore: 95,
    technicalScore: 92,
    communicationScore: 98,
    summary: 'Excellent communication and problem-solving abilities. Highly recommended for the role.'
  }
];

export const timesheetEntries: TimesheetEntry[] = [
  { id: '1', date: '2024-07-28', task: 'Team Stand-up', duration: '30 mins' },
  { id: '2', date: '2024-07-28', task: 'Develop Candidate Management Module', duration: '3 hours' },
  { id: '3', date: '2024-07-27', task: 'Review Project Requirements', duration: '1 hour 30 mins' },
  { id: '4', date: '2024-07-27', task: 'Sync with HR on new job posts', duration: '45 mins' },
  { id: '5', date: '2024-07-26', task: 'Design AI Interview UI', duration: '4 hours' },
];

export const notifications: Notification[] = [
  { id: '1', type: 'email', message: 'New application received from John Doe.', time: '5m ago' },
  { id: '2', type: 'telegram', message: 'Interview reminder: Priya Patel at 3 PM.', time: '1h ago' },
  { id: '3', type: 'system', message: 'Contract for Sneha Reddy has been generated.', time: '2h ago' },
  { id: '4', type: 'email', message: 'Your job post for "Senior React Developer" is now live.', time: '1d ago' },
];

export const contractTemplate = `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made and entered into as of [Start Date], by and between HRAi Corp. ("Company"), and [Candidate Name] ("Employee").

1.  **Position**. The Company agrees to employ the Employee in the position of [Job Title].
2.  **Compensation**. The Company will pay the Employee an annual salary of $[Salary], payable in accordance with the Company's standard payroll practices.
3.  **Start Date**. The Employee's employment will begin on [Start Date].
4.  **Confidentiality**. The Employee agrees to maintain the confidentiality of all proprietary information of the Company.
5.  **Termination**. This Agreement may be terminated by either party with 30 days written notice.

[Additional Clauses]

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

HRAi Corp.
_________________

Employee
_________________
[Candidate Name]
`;
