import { GoogleSpreadsheet, type GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Candidate } from './types';

// The spreadsheet must be shared with the client_email of the service account.
// Please replace this with your actual Spreadsheet ID.
// You can find it in the URL of your Google Sheet, for example:
// https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
const SPREADSHEET_ID = '1nfJkPy5uxUSj9Oem_phfh4NuAsC1WdNEV07uGmonsMk';
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

  await sheet.loadHeaderRow(); // Make sure headers are loaded
  const rows = await sheet.getRows();

  // Create a map of normalized header to original header to handle variations in naming (e.g. "Resume Score" vs "resumescore")
  const headerMap = new Map<string, string>();
  for (const header of sheet.headerValues) {
    const normalized = header.toLowerCase().replace(/\s/g, '');
    if (!headerMap.has(normalized)) {
        headerMap.set(normalized, header);
    }
  }

  const getByNormalizedHeader = (row: GoogleSpreadsheetRow<any>, normalizedHeader: string): any => {
    const originalHeader = headerMap.get(normalizedHeader);
    if (originalHeader) {
        return row.get(originalHeader);
    }
    return undefined;
  }

  const candidates: Candidate[] = rows
    .map((row) => {
      const resumeScoreRaw = getByNormalizedHeader(row, 'resumescore') || '0';
      const resumeScore = parseInt(resumeScoreRaw, 10);
      const status = getByNormalizedHeader(row, 'status');
      const validStatuses: Candidate['status'][] = [
        'Shortlisted',
        'Interviewing',
        'Offered',
        'Rejected',
        'Hired',
      ];

      return {
        id: String(getByNormalizedHeader(row, 'id') ?? ''),
        name: String(getByNormalizedHeader(row, 'name') ?? ''),
        avatarUrl: String(getByNormalizedHeader(row, 'avatarurl') ?? ''),
        resumeScore: isNaN(resumeScore) ? 0 : resumeScore,
        status: validStatuses.includes(status) ? status : 'Shortlisted',
      };
    })
    .filter((c) => c.id && c.name); // Filter out empty or invalid rows

  return candidates;
}
