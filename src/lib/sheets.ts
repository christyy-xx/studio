import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Candidate } from './types';

// The spreadsheet must be shared with the client_email of the service account.
const SPREADSHEET_ID = '13Hf1J3hpp_1vORp1yc7-qQE3AqlPJWVY4jS4KkDTFKM';
const SHEET_TITLE = 'Sheet1'; // The default sheet name is often Sheet1

const serviceAccountAuth = new JWT({
  // env var values are copied from service account credentials file
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

export async function getCandidatesFromSheet(): Promise<Candidate[]> {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn("Google Sheets credentials are not set. Returning empty array.");
      return [];
    }

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET_TITLE];

    if (!sheet) {
      throw new Error(`Sheet with title "${SHEET_TITLE}" not found.`);
    }

    const rows = await sheet.getRows();

    const candidates: Candidate[] = rows.map(row => {
      const resumeScore = parseInt(row.get('resumeScore'), 10);
      const status = row.get('status');
      const validStatuses: Candidate['status'][] = ['Shortlisted', 'Interviewing', 'Offered', 'Rejected', 'Hired'];

      return {
        id: row.get('id') || '',
        name: row.get('name') || '',
        avatarUrl: row.get('avatarUrl') || '',
        resumeScore: isNaN(resumeScore) ? 0 : resumeScore,
        status: validStatuses.includes(status) ? status : 'Shortlisted',
      };
    }).filter(c => c.id && c.name); // Filter out empty or invalid rows

    return candidates;
  } catch (error) {
    console.error('Error fetching candidates from Google Sheet:', error);
    // In case of an error (e.g., permissions), return an empty array
    // to avoid crashing the app.
    return [];
  }
}
