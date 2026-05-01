/**
 * exports.js — .ics, .csv, JSON, and print exports
 */
import { formatDisplayDate } from "./timeline.js";

function toIcsDate(dateStr) { return dateStr.replace(/-/g, ""); }
function escIcs(s) { return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n"); }

function generateICS(milestones, jurisLabel) {
  const now = new Date().toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
  const lines = [
    "BEGIN:VCALENDAR","VERSION:2.0",
    "PRODID:-//ElectWise//Election Timeline//EN",
    "CALSCALE:GREGORIAN","METHOD:PUBLISH",
    `X-WR-CALNAME:ElectWise — ${escIcs(jurisLabel)}`,
  ];
  milestones.forEach(m => {
    if (!m.date) return;
    const d = toIcsDate(m.date);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${m.id}-${d}@electwise`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${d}`,
      `SUMMARY:${escIcs(m.title)}`,
      `DESCRIPTION:${escIcs(m.description + " Actions: " + m.actions.join(" | "))}`,
      `PRIORITY:${m.priority==="High"?1:m.priority==="Medium"?5:9}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(milestones, jurisLabel) {
  downloadFile("election-milestones.ics", generateICS(milestones, jurisLabel), "text/calendar;charset=utf-8");
}

function escCSV(v) {
  const s = v==null?"":String(v);
  return (s.includes(",")||s.includes('"')||s.includes("\n")) ? '"'+s.replace(/"/g,'""')+'"' : s;
}

function generateCSV(milestones) {
  const headers = ["ID","Title","Date","Days Until","Priority","Description","Actions","Documents","Resources"];
  const rows = milestones.map(m=>[
    m.id, m.title, m.date||m.rangeLabel,
    m.daysUntil!=null?m.daysUntil:"N/A",
    m.priority, m.description,
    m.actions.join(" | "),
    (m.documents||[]).join(" | "),
    (m.resources||[]).map(r=>r.name+": "+r.url).join(" | "),
  ]);
  return "\uFEFF"+[headers,...rows].map(r=>r.map(escCSV).join(",")).join("\r\n");
}

function downloadCSV(milestones) {
  downloadFile("election-milestones.csv", generateCSV(milestones), "text/csv;charset=utf-8");
}

function generateJSON(milestones, state) {
  return JSON.stringify({
    jurisdiction: { country: state.country||"", state_province: state.stateProvince||"", county_city: state.countyCity||"" },
    election_type: state.electionType||"generic",
    election_date: state.electionDate||null,
    generated_at: new Date().toISOString(),
    milestones: milestones.map(m=>({
      id:m.id, title:m.title, date:m.date||null, days_until:m.daysUntil??null,
      priority:m.priority, description:m.description, actions:m.actions,
      resources:(m.resources||[]).map(r=>({name:r.name,url:r.url}))
    })),
    export_options:{ics_available:true, csv_available:true},
    notes:["ElectWise — nonpartisan civic education tool.","Verify deadlines with your official election authority.","Not legal advice."]
  }, null, 2);
}

async function copyJSON(milestones, state) {
  try { await navigator.clipboard.writeText(generateJSON(milestones, state)); return true; }
  catch { return false; }
}

function downloadFile(filename, content, mime) {
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([content], {type:mime})),
    download: filename
  });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function escHtml(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function renderExports(milestones, state, t) {
  const container = document.getElementById("exports-container");
  if (!container) return;
  const jurisLabel = [state.country,state.stateProvince,state.countyCity].filter(Boolean).join(", ")||"Generic";

  container.innerHTML = `
    <h2 class="section-title">${t.exportTitle}</h2>
    <p class="section-subtitle">Download your personalized election data in multiple formats.</p>
    <div class="export-grid">
      <div class="export-card glass-card">
        <div class="export-icon">📅</div>
        <h3>iCalendar (.ics)</h3>
        <p>Import into Google Calendar, Apple Calendar, or Outlook.</p>
        <button class="btn btn-primary" id="btn-ics">${t.exportIcs}</button>
      </div>
      <div class="export-card glass-card">
        <div class="export-icon">📊</div>
        <h3>Spreadsheet (.csv)</h3>
        <p>Open in Excel, Google Sheets, or any spreadsheet app.</p>
        <button class="btn btn-primary" id="btn-csv">${t.exportCsv}</button>
      </div>
      <div class="export-card glass-card">
        <div class="export-icon">📋</div>
        <h3>JSON Data</h3>
        <p>Structured JSON for developers and civic apps.</p>
        <button class="btn btn-secondary" id="btn-json">${t.exportJson}</button>
        <div class="json-copied-msg" id="json-copied" hidden>✓ Copied!</div>
      </div>
      <div class="export-card glass-card">
        <div class="export-icon">🖨</div>
        <h3>Print Checklist</h3>
        <p>Black-and-white print-friendly task list.</p>
        <button class="btn btn-ghost" id="btn-print">${t.exportPrint}</button>
      </div>
    </div>
    <div class="json-preview glass-card">
      <div class="json-preview-header">
        <span>JSON Preview (sample)</span>
        <span class="json-schema-badge">machine-readable</span>
      </div>
      <pre class="json-preview-code">${escHtml(generateJSON(milestones.slice(0,2), state))}</pre>
    </div>`;

  document.getElementById("btn-ics").addEventListener("click", () => downloadICS(milestones, jurisLabel));
  document.getElementById("btn-csv").addEventListener("click", () => downloadCSV(milestones));
  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-json").addEventListener("click", async () => {
    const ok = await copyJSON(milestones, state);
    const msg = document.getElementById("json-copied");
    if (msg) { msg.hidden=false; setTimeout(()=>msg.hidden=true, 2500); }
  });
}

export { renderExports, downloadICS, downloadCSV, generateJSON };
