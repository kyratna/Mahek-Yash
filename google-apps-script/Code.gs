// Backend for the Blessings wall and Blessings & RSVP form.
//
// Setup: see README.md → "Blessings & RSVP backend setup" for the full
// step-by-step (create the Sheet, paste this file in, deploy as a Web App,
// paste the resulting URL into src/content.js).
//
// Expects a Google Sheet with two tabs:
//   "Blessings" — header row: Name | Side | Message | Timestamp
//   "RSVP"      — header row: Name | Side | Attending | Guests | Dietary | Timestamp

const BLESSINGS_SHEET_NAME = "Blessings";
const RSVP_SHEET_NAME = "RSVP";

function doGet() {
  const sheet = getSheet_(BLESSINGS_SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const [, ...dataRows] = rows; // drop header row

  const blessings = dataRows
    .filter((row) => row[0]) // skip blank rows
    .map((row) => ({
      name: row[0],
      side: row[1],
      message: row[2],
      timestamp: row[3],
    }))
    .reverse(); // newest first

  return jsonResponse_({ blessings });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.type === "blessing") {
    getSheet_(BLESSINGS_SHEET_NAME).appendRow([
      data.name,
      data.side,
      data.message,
      new Date(),
    ]);
  } else if (data.type === "rsvp") {
    getSheet_(RSVP_SHEET_NAME).appendRow([
      data.name,
      data.side,
      data.attending,
      data.guests,
      data.dietary,
      new Date(),
    ]);
  } else {
    return jsonResponse_({ ok: false, error: "Unknown submission type" });
  }

  return jsonResponse_({ ok: true });
}

function getSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet tab "${name}" not found — check the setup steps in README.md.`);
  }
  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
