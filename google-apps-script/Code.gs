// Backend for the Blessings wall and Blessings & RSVP form.
//
// Setup: see README.md → "Blessings & RSVP backend setup" for the full
// step-by-step (create the Sheet, paste this file in, deploy as a Web App,
// paste the resulting URL into src/content.js).
//
// Expects a Google Sheet with four tabs, one per side per form, each with
// a header row exactly as below:
//   "BLESSINGS_BRIDE" / "BLESSINGS_GROOM" — Name | Side | Message | Timestamp
//   "RSVP_BRIDE" / "RSVP_GROOM"           — Name | Side | Attending | Guests | Parking Required | Timestamp

const BLESSINGS_SHEETS = ["BLESSINGS_BRIDE", "BLESSINGS_GROOM"];
const SHEET_BY_TYPE_AND_SIDE = {
  blessing: { "Bride Side": "BLESSINGS_BRIDE", "Groom Side": "BLESSINGS_GROOM" },
  rsvp: { "Bride Side": "RSVP_BRIDE", "Groom Side": "RSVP_GROOM" },
};

function doGet() {
  const blessings = BLESSINGS_SHEETS.flatMap(readBlessingsSheet_).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp) // newest first, across both sides
  );
  return jsonResponse_({ blessings });
}

function readBlessingsSheet_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return []; // tab not created yet — skip rather than fail the whole request

  const [, ...dataRows] = sheet.getDataRange().getValues(); // drop header row
  return dataRows
    .filter((row) => row[0]) // skip blank rows
    .map((row) => ({
      name: row[0],
      side: row[1],
      message: row[2],
      timestamp: row[3],
    }));
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheetName = (SHEET_BY_TYPE_AND_SIDE[data.type] || {})[data.side];
  if (!sheetName) {
    return jsonResponse_({ ok: false, error: "Unknown submission type or side" });
  }

  if (data.type === "blessing") {
    getSheet_(sheetName).appendRow([data.name, data.side, data.message, new Date()]);
  } else if (data.type === "rsvp") {
    getSheet_(sheetName).appendRow([
      data.name,
      data.side,
      data.attending,
      data.guests,
      data.parkingRequired,
      new Date(),
    ]);
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
