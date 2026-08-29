// ==========================================================================
// Yash & Mahek Wedding — Instant Two-Way Firebase ↔ Google Sheets & Telegram
// ==========================================================================
//
// 1. Instant Sheet ↔ Firebase Bidirectional Synchronization.
// 2. Real-Time Telegram Notifications for every Blessing & RSVP.
// 3. Native Telegram "🗑️ Delete from Live Wall" Callback Button:
//    - No browser or URL navigation.
//    - Strikes through the message in Telegram (<s>...</s>) and marks it REMOVED.
//    - Shows a subtle in-app toast at the bottom of the screen.
// 4. Live Heart Counts (❤️) synchronized.

const FIREBASE_PROJECT_ID = "yashmahekwedding";
const FIREBASE_API_KEY = "AIzaSyB-H7JyM-REapOa3PftjigCqhMBjaSOu3Y";

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8998088060:AAFxapirVCDt0sIXQ0l9OmAN0Y1cduGNNLs";
const TELEGRAM_CHAT_ID = "-1004270754193";

const BLESSINGS_SHEETS = ["BLESSINGS_BRIDE", "BLESSINGS_GROOM"];
const SHEET_BY_TYPE_AND_SIDE = {
  blessing: { "Bride Side": "BLESSINGS_BRIDE", "Groom Side": "BLESSINGS_GROOM" },
  rsvp: { "Bride Side": "RSVP_BRIDE", "Groom Side": "RSVP_GROOM" },
};

// Google Drive Gallery Folder Configuration
// Set your Google Drive Folder ID here or via the Sheet menu: 💌 Wedding Admin -> 🖼️ Set Gallery Google Drive Folder
const GALLERY_DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";

/**
 * Creates custom menu in Google Sheets on open
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("💌 Wedding Admin")
    .addItem("⚡ Instant 2-Way Sync (Firebase ↔ Sheet)", "instantBidirectionalSync")
    .addItem("⬇️ Pull All Blessings & Hearts from Firebase", "pullAllBlessingsFromFirebaseToSheet")
    .addSeparator()
    .addItem("🖼️ Set Gallery Google Drive Folder ID", "promptSetGalleryFolderId")
    .addItem("🔄 Sync Drive Photos to GALLERY Sheet", "syncDriveFolderToGallerySheet")
    .addSeparator()
    .addItem("🚀 Activate Instant Auto-Sync Triggers", "setupInstantTriggers")
    .addSeparator()
    .addItem("🤖 Register Telegram Webhook (For Native Delete Button)", "registerTelegramWebhook")
    .addItem("🧪 Send Test Telegram Alert", "sendTestTelegramNotification")
    .addToUi();
}

/**
 * Prompt to set Google Drive Gallery Folder ID or Link
 */
function promptSetGalleryFolderId() {
  const ui = SpreadsheetApp.getUi();
  const current = PropertiesService.getScriptProperties().getProperty("GALLERY_FOLDER_ID") || GALLERY_DRIVE_FOLDER_ID;
  const res = ui.prompt(
    "Set Gallery Google Drive Folder",
    "Paste your Google Drive Folder Link or Folder ID:\n(Make sure folder sharing is set to 'Anyone with the link can view')\n\nCurrent: " + current,
    ui.ButtonSet.OK_CANCEL
  );
  if (res.getSelectedButton() === ui.Button.OK) {
    const raw = res.getResponseText().trim();
    if (!raw) return;
    const folderId = extractDriveFolderId_(raw);
    PropertiesService.getScriptProperties().setProperty("GALLERY_FOLDER_ID", folderId);
    ui.alert("✅ Saved! Gallery folder set to:\n" + folderId + "\n\nSyncing photos now...");
    syncDriveFolderToGallerySheet();
  }
}

/**
 * Extracts clean Google Drive folder ID from full URL or raw ID
 */
function extractDriveFolderId_(input) {
  if (!input) return "";
  const match = input.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const matchId = input.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];
  return input.trim();
}

/**
 * Extracts clean Google Drive file ID from full URL or raw ID
 */
function extractDriveFileId_(input) {
  if (!input) return "";
  const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const matchId = input.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];
  return input.trim();
}

/**
 * Synchronizes Drive photos into a 'GALLERY' sheet tab (Interactive with UI alert)
 */
function syncDriveFolderToGallerySheet() {
  const count = syncDriveFolderToGallerySheet_Silent();
  if (count >= 0) {
    SpreadsheetApp.getUi().alert(`✅ Synced ${count} photos from Google Drive to the GALLERY sheet!`);
  } else {
    SpreadsheetApp.getUi().alert("⚠️ Please set a valid Google Drive Folder ID first using the Wedding Admin menu.");
  }
}

/**
 * Silent background synchronizer (Runs automatically on schedule and on API requests)
 */
function syncDriveFolderToGallerySheet_Silent() {
  const folderId = PropertiesService.getScriptProperties().getProperty("GALLERY_FOLDER_ID") || GALLERY_DRIVE_FOLDER_ID;
  if (!folderId || folderId === "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
    return -1;
  }

  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    const photos = [];

    while (files.hasNext()) {
      const file = files.next();
      const mime = file.getMimeType();
      if (mime.startsWith("image/")) {
        const fileId = file.getId();
        photos.push([
          `https://lh3.googleusercontent.com/d/${fileId}`,
          file.getName().replace(/\.[^/.]+$/, ""), // title without extension
          fileId,
          new Date(file.getDateCreated()),
        ]);
      }
    }

    // Sort chronologically
    photos.sort((a, b) => new Date(a[3]) - new Date(b[3]));

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("GALLERY");
    if (!sheet) {
      sheet = ss.insertSheet("GALLERY");
    }
    sheet.clear();
    sheet.appendRow(["IMAGE_URL", "PHOTO_CAPTION", "DRIVE_FILE_ID", "DATE_ADDED"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f0e6dd");

    if (photos.length > 0) {
      sheet.getRange(2, 1, photos.length, 4).setValues(photos);
    }
    SpreadsheetApp.flush();
    return photos.length;
  } catch (err) {
    Logger.log("Silent sync error: " + err);
    return -1;
  }
}

/**
 * Returns dynamic gallery photos from Google Drive in real-time
 * 1. Reads directly from Google Drive folder (live on the fly)
 * 2. Automatically updates the GALLERY sheet tab in the background
 */
function getGalleryPhotos_() {
  const folderId = PropertiesService.getScriptProperties().getProperty("GALLERY_FOLDER_ID") || GALLERY_DRIVE_FOLDER_ID;

  // Real-time live read from Google Drive folder
  if (folderId && folderId !== "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
    try {
      const folder = DriveApp.getFolderById(folderId);
      const files = folder.getFiles();
      const photos = [];
      while (files.hasNext()) {
        const file = files.next();
        if (file.getMimeType().startsWith("image/")) {
          photos.push({
            src: `https://lh3.googleusercontent.com/d/${file.getId()}`,
            alt: file.getName().replace(/\.[^/.]+$/, ""),
            id: file.getId(),
            created: file.getDateCreated().getTime(),
          });
        }
      }
      // Sort oldest to newest
      photos.sort((a, b) => a.created - b.created);

      if (photos.length > 0) {
        return photos;
      }
    } catch (err) {
      Logger.log("Direct folder read error: " + err);
    }
  }

  // Fallback: Read from GALLERY sheet tab if populated
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("GALLERY");

  if (sheet) {
    const values = sheet.getDataRange().getValues();
    if (values.length > 1) {
      const [, ...rows] = values;
      const list = rows
        .filter((r) => r[0])
        .map((r, idx) => {
          const rawUrl = String(r[0]).trim();
          const fileId = extractDriveFileId_(rawUrl);
          const src = fileId && !rawUrl.includes("lh3.googleusercontent.com")
            ? `https://lh3.googleusercontent.com/d/${fileId}`
            : rawUrl;
          return {
            src: src,
            alt: r[1] ? String(r[1]).trim() : `Wedding Memory ${idx + 1}`,
            id: r[2] ? String(r[2]).trim() : fileId || `photo-${idx}`,
          };
        });
      if (list.length > 0) return list;
    }
  }

  return [];
}

/**
 * Real-time trigger: Fires IMMEDIATELY when any row is deleted or modified in Sheet!
 */
function handleSpreadsheetChange_(e) {
  try {
    instantBidirectionalSync();
  } catch (err) {
    Logger.log("Real-time onChange error: " + err);
  }
}

/**
 * Web App GET endpoint:
 * Handles:
 * 1. ?action=getGallery -> Returns dynamic photos from Google Drive / Sheet
 * 2. Default -> Returns blessings for website
 */
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === "getGallery") {
    const photos = getGalleryPhotos_();
    return jsonResponse_({ ok: true, photos: photos });
  }

  const blessings = BLESSINGS_SHEETS.flatMap(readBlessingsSheet_).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  return jsonResponse_({ blessings });
}

function readBlessingsSheet_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];

  const [, ...dataRows] = sheet.getDataRange().getValues();
  return dataRows
    .filter((row) => row[0])
    .map((row) => ({
      name: row[0],
      side: row[1],
      message: row[2],
      timestamp: row[3],
      hearts: typeof row[4] === "number" ? row[4] : 1,
      id: row[5] || "",
    }));
}

/**
 * Web App POST endpoint:
 * Handles both Website Submissions AND Native Telegram Callback Queries
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: "Empty request" });
    }

    const payload = JSON.parse(e.postData.contents);

    // CASE 1: Telegram Native Inline Button Callback (Admin clicked Delete)
    if (payload.callback_query) {
      return handleTelegramCallback_(payload.callback_query);
    }

    // CASE 2: Website Submission (Blessing or RSVP)
    const data = payload;
    const sheetName = (SHEET_BY_TYPE_AND_SIDE[data.type] || {})[data.side];
    if (!sheetName) {
      return jsonResponse_({ ok: false, error: "Unknown submission type or side" });
    }

    const sheet = getOrCreateSheet_(sheetName, data.type);

    if (data.type === "blessing") {
      sheet.appendRow([
        data.name,
        data.side,
        data.message,
        new Date(),
        1, // initial hearts
        data.firestoreId || "",
      ]);
      SpreadsheetApp.flush();
      sendTelegramBlessingNotification_(data);
    } else if (data.type === "rsvp") {
      sheet.appendRow([
        data.name,
        data.side,
        data.attending,
        data.guests,
        data.parkingRequired,
        new Date(),
        data.firestoreId || "",
      ]);
      SpreadsheetApp.flush();
      sendTelegramRsvpNotification_(data);
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    Logger.log("doPost error: " + err);
    return jsonResponse_({ ok: false, error: err.toString() });
  }
}

// ==========================================================================
// Telegram Bot Notifications & Native Inline Moderation
// ==========================================================================

/**
 * Sends a Telegram notification when a new Blessing is posted
 */
function sendTelegramBlessingNotification_(data) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes("YOUR_")) return;

  const text =
    `🌸 <b>New Blessing on Wedding Wall!</b> 🌸\n\n` +
    `👤 <b>Name:</b> ${escapeHtml_(data.name)}\n` +
    `🎪 <b>Side:</b> ${escapeHtml_(data.side)}\n` +
    `💌 <b>Message:</b>\n<i>"${escapeHtml_(data.message)}"</i>\n\n` +
    `⏰ <b>Time:</b> ${Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a")}`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "🗑️ Delete from Live Wall",
          callback_data: `del_blessing:${data.firestoreId || ""}`,
        },
      ],
    ],
  };

  sendTelegramApi_("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}

/**
 * Sends a Telegram notification when a new RSVP is submitted
 */
function sendTelegramRsvpNotification_(data) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes("YOUR_")) return;

  const isAttending = data.attending === "Yes" ? "✅ Joyfully Accept (Attending)" : "❌ Regretfully Decline";
  const text =
    `🎉 <b>New RSVP Received!</b> 🎉\n\n` +
    `👤 <b>Name:</b> ${escapeHtml_(data.name)}\n` +
    `🎪 <b>Side:</b> ${escapeHtml_(data.side)}\n` +
    `✨ <b>Status:</b> ${isAttending}\n` +
    `👥 <b>Guests Count:</b> ${escapeHtml_(String(data.guests || 1))}\n` +
    `🚗 <b>Parking Needed:</b> ${escapeHtml_(data.parkingRequired || "No")}\n\n` +
    `⏰ <b>Time:</b> ${Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a")}`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "🗑️ Delete RSVP",
          callback_data: `del_rsvp:${data.firestoreId || ""}`,
        },
      ],
    ],
  };

  sendTelegramApi_("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}

/**
 * Handles native Telegram button clicks (In-app, no browser navigation)
 */
function handleTelegramCallback_(callbackQuery) {
  const callbackId = callbackQuery.id;
  const callbackData = callbackQuery.data || "";
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const fromUser = callbackQuery.from?.first_name || "Admin";

  // 1. Immediately acknowledge Telegram callback within 0.2s to prevent 5s timeout!
  try {
    sendTelegramApi_("answerCallbackQuery", {
      callback_query_id: callbackId,
      text: "🗑️ Deleting from live website...",
      show_alert: false,
    });
  } catch (err) {
    Logger.log("answerCallbackQuery error: " + err);
  }

  const [action, docId] = callbackData.split(":");

  if (action === "del_blessing" || action === "del_rsvp") {
    // 2. Delete from Firebase Firestore immediately
    if (docId) {
      const collectionName = action === "del_blessing" ? "blessings" : "rsvps";
      const deleteUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionName}/${docId}?key=${FIREBASE_API_KEY}`;
      UrlFetchApp.fetch(deleteUrl, { method: "delete", muteHttpExceptions: true });
    }

    // 3. Delete row from Google Sheet
    deleteRowFromSheetByDocId_(docId);

    // 4. Edit Telegram message in-place: Strike through text and show REMOVED
    const originalText = message.text || "";
    const updatedText =
      `<s>${escapeHtml_(originalText)}</s>\n\n` +
      `❌ <b>REMOVED & DELETED by ${escapeHtml_(fromUser)}</b>\n` +
      `<i>(This wish is now deleted from Firebase and the live website)</i>`;

    sendTelegramApi_("editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text: updatedText,
      parse_mode: "HTML",
    });
  }

  return jsonResponse_({ ok: true });
}

function deleteRowFromSheetByDocId_(docId) {
  if (!docId) return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  sheets.forEach((sheet) => {
    const values = sheet.getDataRange().getValues();
    for (let i = values.length - 1; i >= 1; i--) {
      const rowDocId = values[i][5] || values[i][4] || values[i][6];
      if (String(rowDocId).trim() === String(docId).trim()) {
        sheet.deleteRow(i + 1);
        Logger.log(`Deleted row ${i + 1} from sheet ${sheet.getName()}`);
        break;
      }
    }
  });
}

function sendTelegramApi_(method, payload) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes("YOUR_")) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
  return UrlFetchApp.fetch(url, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
}

/**
 * Registers this Google Apps Script Web App URL with Telegram Bot Webhook
 */
function registerTelegramWebhook() {
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    "Register Telegram Webhook",
    "Enter your Google Apps Script Web App URL (the URL ending with /exec):",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  const webAppUrl = prompt.getResponseText().trim();

  if (!webAppUrl || !webAppUrl.includes("/exec")) {
    ui.alert("Invalid URL. It must be your deployed Apps Script URL ending in /exec.");
    return;
  }

  const res = sendTelegramApi_("setWebhook", { url: webAppUrl });
  const resultText = res ? res.getContentText() : "Failed";

  ui.alert("Telegram Webhook Response:\n" + resultText);
}

/**
 * Test function to verify Telegram Bot connectivity
 */
function sendTestTelegramNotification() {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes("YOUR_")) {
    SpreadsheetApp.getUi().alert("Please fill TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID at the top of Code.gs first!");
    return;
  }

  sendTelegramBlessingNotification_({
    name: "Test Guest (Yash & Mahek)",
    side: "Bride Side",
    message: "This is a test blessing notification with native in-app Delete! 🌸",
    firestoreId: "test_doc_id",
  });

  SpreadsheetApp.getActiveSpreadsheet().toast("Test alert sent to Telegram! Check your group.", "Telegram Bot", 5);
}

function escapeHtml_(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ==========================================================================
// Super-Fast Bi-Directional Sync (Sheet ↔ Firebase)
// ==========================================================================

/**
 * Safe 2-Way Synchronization:
 * 1. Pulls any missing Firebase blessings into the appropriate Sheet tab.
 * 2. Synchronizes live heart reaction counts (❤️).
 * 3. Deletion occurs ONLY when explicitly requested via Telegram 'Delete' button.
 */
function instantBidirectionalSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/blessings?key=${FIREBASE_API_KEY}`;
  const response = UrlFetchApp.fetch(firestoreUrl, { muteHttpExceptions: true });

  if (response.getResponseCode() !== 200) {
    Logger.log("Firestore connection error: " + response.getContentText());
    return;
  }

  const data = JSON.parse(response.getContentText());
  const firestoreDocs = data.documents || [];
  
  const firestoreMap = new Map();
  firestoreDocs.forEach((doc) => {
    const docId = doc.name.split("/").pop();
    const fields = doc.fields || {};
    const hearts = fields.hearts?.integerValue ? parseInt(fields.hearts.integerValue, 10) : 1;
    firestoreMap.set(docId, {
      id: docId,
      name: fields.name?.stringValue || "",
      side: fields.side?.stringValue || "Bride Side",
      message: fields.message?.stringValue || "",
      timestamp: fields.timestamp?.timestampValue || new Date().toISOString(),
      hearts: hearts,
    });
  });

  const sheetDocIds = new Set();

  BLESSINGS_SHEETS.forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return;

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const docId = String(row[5] || row[4] || "").trim();

      if (!docId) continue;
      sheetDocIds.add(docId);

      if (firestoreMap.has(docId)) {
        const liveHearts = firestoreMap.get(docId).hearts;
        if (row[4] !== liveHearts) {
          sheet.getRange(i + 1, 5).setValue(liveHearts);
        }
      }
    }
  });

  // Pull any Firebase documents into the sheet if they are not already recorded
  let addedToSheetCount = 0;
  firestoreDocs.forEach((doc) => {
    const docId = doc.name.split("/").pop();
    if (!sheetDocIds.has(docId)) {
      const item = firestoreMap.get(docId);
      if (!item) return;
      const targetSheetName = item.side.toLowerCase().includes("groom") ? "BLESSINGS_GROOM" : "BLESSINGS_BRIDE";
      const targetSheet = ss.getSheetByName(targetSheetName);
      if (targetSheet) {
        targetSheet.appendRow([
          item.name,
          item.side,
          item.message,
          item.timestamp,
          item.hearts,
          docId,
        ]);
        sheetDocIds.add(docId);
        addedToSheetCount++;
      }
    }
  });

  try {
    const msg = `Sync complete! Synced ${firestoreDocs.length} live blessings across Firebase & Sheet.`;
    ss.toast(msg, "Safe Sync ⚡", 4);
  } catch (e) {}
}

/**
 * Pulls all blessings from Firebase Firestore and writes them into the Sheet tabs
 */
function pullAllBlessingsFromFirebaseToSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/blessings?key=${FIREBASE_API_KEY}`;
  const response = UrlFetchApp.fetch(firestoreUrl, { muteHttpExceptions: true });

  if (response.getResponseCode() !== 200) {
    ss.toast("Failed to connect to Firebase", "Error", 5);
    return;
  }

  const data = JSON.parse(response.getContentText());
  const documents = data.documents || [];

  const brideSheet = getOrCreateSheet_("BLESSINGS_BRIDE", "blessing");
  const groomSheet = getOrCreateSheet_("BLESSINGS_GROOM", "blessing");

  clearSheetData_(brideSheet);
  clearSheetData_(groomSheet);

  let count = 0;
  documents.forEach((doc) => {
    const fields = doc.fields || {};
    const docId = doc.name.split("/").pop();
    const name = fields.name?.stringValue || "";
    const side = fields.side?.stringValue || "Bride Side";
    const message = fields.message?.stringValue || "";
    const timestamp = fields.timestamp?.timestampValue || new Date().toISOString();
    const hearts = fields.hearts?.integerValue ? parseInt(fields.hearts.integerValue, 10) : 1;

    const targetSheet = side.toLowerCase().includes("groom") ? groomSheet : brideSheet;
    targetSheet.appendRow([name, side, message, timestamp, hearts, docId]);
    count++;
  });

  ss.toast(`Successfully imported ${count} blessings with live heart counts from Firebase!`, "Wedding Admin", 5);
}

/**
 * Installs both Real-Time onChange Trigger + 1-Minute Backup Cron Trigger
 */
function setupInstantTriggers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach((t) => {
    const fn = t.getHandlerFunction();
    if (
      fn === "handleSpreadsheetChange_" ||
      fn === "instantBidirectionalSync" ||
      fn === "syncSheetDeletionsToFirebase" ||
      fn === "syncDriveFolderToGallerySheet_Silent"
    ) {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger("handleSpreadsheetChange_")
    .forSpreadsheet(ss)
    .onChange()
    .create();

  // 1-Minute Auto-Sync for Firebase ↔ Sheets Bi-directional Sync
  ScriptApp.newTrigger("instantBidirectionalSync")
    .timeBased()
    .everyMinutes(1)
    .create();

  // 1-Minute Auto-Sync for Google Drive Gallery Photos
  ScriptApp.newTrigger("syncDriveFolderToGallerySheet_Silent")
    .timeBased()
    .everyMinutes(1)
    .create();

  ss.toast("🚀 All Instant Auto-Sync Triggers are active! (Every 1 minute for Sheet ↔ Firebase & Drive Gallery)", "Activated", 6);
}

function clearSheetData_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
}

function getOrCreateSheet_(name, type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (type === "blessing") {
    sheet.getRange(1, 1, 1, 6).setValues([["Name", "Side", "Message", "Timestamp", "Hearts (❤️)", "FirebaseDocID"]]);
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else if (type === "rsvp") {
    sheet.getRange(1, 1, 1, 7).setValues([["Name", "Side", "Attending", "Guests", "Parking Required", "Timestamp", "FirebaseDocID"]]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
