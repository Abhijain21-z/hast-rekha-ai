/**
 * HastRekhaAI — free users → Google Sheet webhook
 *
 * SETUP (2 minutes):
 *   1. Open your Google Sheet.
 *   2. Extensions → Apps Script.
 *   3. Delete the sample code, paste this whole file.
 *   4. Replace PASTE_SECRET_HERE with the secret from your .env.local
 *      (GOOGLE_SHEETS_WEBHOOK_SECRET).
 *   5. Save, then Deploy → New deployment → Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *      Authorize the permissions Google asks for.
 *   6. Copy the Web app URL (ends in /exec) and send it to the developer.
 *
 * The app POSTs the complete free-reader table every day at 9:00 AM IST.
 * This script clears the "Free Users" tab and rewrites it, so retries never
 * create duplicate rows. Other tabs are untouched.
 */

const SECRET = "PASTE_SECRET_HERE";
const DEFAULT_SHEET_NAME = "Free Users";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: "empty request" });
    }

    const body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== SECRET) {
      return json({ ok: false, error: "unauthorized" });
    }

    const headers = Array.isArray(body.headers) ? body.headers : [];
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const sheetName = body.sheetName || DEFAULT_SHEET_NAME;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      sheet.clear();

      const width = Math.max(
        headers.length,
        rows.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0),
        1,
      );

      if (headers.length) {
        const normalizedHeaders = headers.slice();
        while (normalizedHeaders.length < width) normalizedHeaders.push("");
        sheet
          .getRange(1, 1, 1, width)
          .setValues([normalizedHeaders])
          .setFontWeight("bold")
          .setBackground("#f3e8c8")
          .setFontColor("#2b1550");
        sheet.setFrozenRows(1);
      }

      if (rows.length) {
        const normalizedRows = rows.map((row) => {
          const out = Array.isArray(row) ? row.slice() : [];
          while (out.length < width) out.push("");
          return out;
        });
        const range = sheet.getRange(2, 1, normalizedRows.length, width);
        range.setNumberFormat("@");
        range.setValues(normalizedRows);
      }

      sheet.autoResizeColumns(1, width);

      return json({
        ok: true,
        count: rows.length,
        sheet: sheetName,
        syncedAt: body.syncedAt || new Date().toISOString(),
      });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: "hastrekha-free-users-sheet" });
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
