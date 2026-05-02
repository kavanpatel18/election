/**
 * timeline.js
 * Computes milestone dates from election date + offset, renders timeline cards.
 */

import { JURISDICTIONS, ROLE_MILESTONES } from "../data/jurisdictions.js";

/**
 * Compute absolute dates for all milestones given an election date string.
 * @param {string} jurisdictionKey - e.g. "us_national", "generic"
 * @param {string|null} electionDateStr - ISO date string (YYYY-MM-DD) or null
 * @param {string} role - voter | candidate | poll_worker | campaign_staff | educator
 * @returns {Array} computed milestone objects with .date and .daysUntil fields
 */
function computeMilestones(jurisdictionKey, electionDateStr, role) {
  const juris = JURISDICTIONS[jurisdictionKey] || JURISDICTIONS.generic;
  let milestones = [...juris.milestones];

  // Add role-specific milestones
  if (role === "candidate" && ROLE_MILESTONES.candidate) {
    milestones = [...ROLE_MILESTONES.candidate, ...milestones];
  } else if (role === "poll_worker" && ROLE_MILESTONES.poll_worker) {
    milestones = [...ROLE_MILESTONES.poll_worker, ...milestones];
  } else if (role === "campaign_staff" && ROLE_MILESTONES.campaign_staff) {
    milestones = [...ROLE_MILESTONES.campaign_staff, ...milestones];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  milestones = milestones.map((m) => {
    let dateObj = null;
    let daysUntil = null;

    if (electionDateStr) {
      dateObj = new Date(electionDateStr + "T00:00:00");
      dateObj.setHours(0, 0, 0, 0);
      dateObj.setDate(dateObj.getDate() + m.offsetDays);
      daysUntil = Math.round((dateObj - today) / (1000 * 60 * 60 * 24));
    }

    return {
      ...m,
      date: dateObj ? formatDate(dateObj) : null,
      dateObj,
      daysUntil,
    };
  });

  // Sort chronologically
  milestones.sort((a, b) => {
    if (!a.dateObj && !b.dateObj) return 0;
    if (!a.dateObj) return 1;
    if (!b.dateObj) return -1;
    return a.dateObj - b.dateObj;
  });

  return milestones;
}

function formatDate(dateObj) {
  return dateObj.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr, lang = "en") {
  if (!dateStr) return "Date TBD";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysLabel(daysUntil, t) {
  if (daysUntil === null) return "";
  if (daysUntil === 0) return t.today;
  if (daysUntil > 0) return `${daysUntil} ${t.daysUntil}`;
  return `${Math.abs(daysUntil)} ${t.daysAgo}`;
}

function priorityClass(priority) {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-med";
  return "priority-low";
}

function priorityLabel(priority, t) {
  if (priority === "High") return t.highPriority;
  if (priority === "Medium") return t.medPriority;
  return t.lowPriority;
}

/**
 * Renders the full timeline section into #timeline-container
 */
function renderTimeline(milestones, state, t) {
  const container = document.getElementById("timeline-container");
  if (!container) return;

  const isGeneric = !state.electionDate;
  let html = "";

  if (isGeneric) {
    html += `<div class="disclaimer-banner" role="alert">
      <span class="disclaimer-icon">⚠️</span>
      <span>${t.genericDisclaimer}</span>
    </div>`;
  }

  // Quick Summary cards
  const upcomingHigh = milestones.filter((m) => m.priority === "High" && (m.daysUntil === null || m.daysUntil >= 0)).slice(0, 4);
  html += `<section class="quick-summary" aria-label="Quick Summary">
    <h2 class="section-title">Quick Summary</h2>
    <div class="summary-grid">
      ${upcomingHigh
        .map(
          (m) => `
        <div class="summary-card priority-border-${m.priority.toLowerCase()}">
          <div class="summary-card-title">${m.title}</div>
          <div class="summary-card-date">${m.date ? formatDisplayDate(m.date, state.lang) : m.rangeLabel}</div>
          ${m.daysUntil !== null ? `<div class="summary-card-days ${m.daysUntil <= 7 && m.daysUntil >= 0 ? "days-urgent" : ""}">${daysLabel(m.daysUntil, t)}</div>` : ""}
        </div>`
        )
        .join("")}
    </div>
  </section>`;

  // Timeline Rail
  html += `<section class="timeline-section" aria-label="Personalized Timeline">
    <h2 class="section-title">Personalized Timeline</h2>
    <div class="timeline-rail" role="list">`;

  milestones.forEach((m, i) => {
    const isPast = m.daysUntil !== null && m.daysUntil < 0;
    const isToday = m.daysUntil === 0;
    const isElectionDay = m.id === "election_day" || m.id === "polling_day";

    html += `
      <div class="timeline-item ${isPast ? "past" : ""} ${isToday ? "today" : ""} ${isElectionDay ? "election-day-item" : ""}" 
           role="listitem" data-milestone-id="${m.id}">
        <div class="timeline-dot-wrap">
          <div class="timeline-dot ${priorityClass(m.priority)} ${isElectionDay ? "dot-election" : ""}">
            ${isElectionDay ? "🗳" : isToday ? "★" : i + 1}
          </div>
          ${i < milestones.length - 1 ? '<div class="timeline-line"></div>' : ""}
        </div>
        <div class="milestone-card glass-card" tabindex="0" aria-label="${m.title}">
          <div class="milestone-header">
            <h3 class="milestone-title">${m.title}</h3>
            <span class="priority-chip ${priorityClass(m.priority)}">${priorityLabel(m.priority, t)}</span>
          </div>
          <div class="milestone-date-row">
            <span class="milestone-date">${m.date ? formatDisplayDate(m.date, state.lang) : m.rangeLabel}</span>
            ${m.daysUntil !== null ? `<span class="days-badge ${m.daysUntil >= 0 ? "days-future" : "days-past"} ${m.daysUntil <= 7 && m.daysUntil >= 0 ? "days-urgent" : ""}">${daysLabel(m.daysUntil, t)}</span>` : ""}
          </div>
          <p class="milestone-description">${m.description}</p>
          <details class="milestone-details">
            <summary class="milestone-details-toggle">Actions & Documents</summary>
            <div class="milestone-details-body">
              <div class="milestone-actions">
                <strong>${t.actionItems}:</strong>
                <ul class="action-list">
                  ${m.actions.map((a) => `<li>${a}</li>`).join("")}
                </ul>
              </div>
              ${
                m.documents && m.documents.length > 0
                  ? `<div class="milestone-docs">
                  <strong>${t.requiredDocs}:</strong>
                  <ul class="doc-list">
                    ${m.documents.map((d) => `<li>📄 ${d}</li>`).join("")}
                  </ul>
                </div>`
                  : ""
              }
              ${
                m.resources && m.resources.length > 0
                  ? `<div class="milestone-resources">
                  <strong>${t.officialResources}:</strong>
                  <ul class="resource-list">
                    ${m.resources.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link">🔗 ${r.name}</a></li>`).join("")}
                  </ul>
                </div>`
                  : ""
              }
            </div>
          </details>
        </div>
      </div>`;
  });

  html += `</div></section>`;
  container.innerHTML = html;
}

export { computeMilestones, renderTimeline, formatDate, formatDisplayDate };
