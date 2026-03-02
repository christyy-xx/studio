import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Candidate } from './types';

// The spreadsheet must be shared with the client_email of the service account.
// Please replace this with your actual Spreadsheet ID.
// You can find it in the URL of your Google Sheet, for example:
// https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_TITLE = 'Sheet1'; // The default sheet name is often Sheet1

export async function getCandidatesFromSheet(): Promise<Candidate[]> {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE' || !SPREADSHEET_ID) {
    throw new Error(
      "Please set your Google Spreadsheet ID in `src/lib/sheets.ts`. You can find the ID in your sheet's URL."
    );
  }
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error(
      'Google Sheets credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY) are not set in your .env file. Please add them to connect to your sheet.'
    );
  }

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

  try {
    await doc.loadInfo();
  } catch (e: any) {
    if (e.response?.status === 404) {
      throw new Error(`Could not find a Google Sheet with ID "${SPREADSHEET_ID}". Please check the ID and that you have shared the sheet with the service account email.`);
    }
    throw e;
  }

  const sheet = doc.sheetsByTitle[SHEET_TITLE];

  if (!sheet) {
    throw new Error(`Sheet with title "${SHEET_TITLE}" not found in the spreadsheet. Please check the sheet name.`);
  }

  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();

  const candidates: Candidate[] = rows
    .map((row) => {
      const resumeScore = parseInt(row.get('resumeScore'), 10);
      const status = row.get('status');
      const validStatuses: Candidate['status'][] = [
        'Shortlisted',
        'Interviewing',
        'Offered',
        'Rejected',
        'Hired',
      ];

      return {
        id: String(row.get('id') ?? ''),
        name: String(row.get('name') ?? ''),
        avatarUrl: String(row.get('avatarUrl') ?? ''),
        resumeScore: isNaN(resumeScore) ? 0 : resumeScore,
        status: validStatuses.includes(status) ? status : 'Shortlisted',
      };
    })
    .filter((c) => c.id && c.name); // Filter out empty or invalid rows

  return candidates;
}
