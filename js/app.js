/**
 * app.js — Main orchestrator: state machine, wizard, routing, theme, language.
 */
import { TRANSLATIONS } from "./i18n.js";
import { JURISDICTIONS } from "../data/jurisdictions.js";
import { computeMilestones, renderTimeline } from "./timeline.js";
import { renderChecklist } from "./checklist.js";
import { renderQuiz } from "./quiz.js";
import { renderScenarios } from "./scenarios.js";
import { renderExports } from "./exports.js";

// ── App State ─────────────────────────────────────────────────────────────────
const state = {
  lang: "en",
  highContrast: false,
  readingLevel: "default",
  // Wizard inputs
  country: "",
  stateProvince: "",
  countyCity: "",
  jurisdictionKey: "generic",
  electionType: "",
  electionDate: "",
  role: "voter",
  votingMethod: "",
  regStatus: "",
  // Computed
  milestones: [],
  currentSection: "hero",
};

// ── State Persistence ────────────────────────────────────────────────────────
const STATE_KEY = "electwise_state";

function loadState() {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Could not load state", e);
  }
  return null;
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Could not save state", e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem("electwise_checklist");
  } catch (e) {}
}

let t = TRANSLATIONS.en;

// ── Wizard Steps ──────────────────────────────────────────────────────────────
const WIZARD_STEPS = [
  "jurisdiction", "election-type", "election-date", "role", "voting-method", "accessibility"
];

let wizardStep = 0;

function getT() { return TRANSLATIONS[state.lang] || TRANSLATIONS.en; }

// ── Rendering helpers ─────────────────────────────────────────────────────────
function setSection(id) {
  document.querySelectorAll(".app-section").forEach(s => {
    s.hidden = s.id !== `section-${id}`;
  });
  document.querySelectorAll(".nav-link").forEach(a => {
    a.classList.toggle("active", a.dataset.section === id);
  });
  state.currentSection = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDashboard() {
  t = getT();
  state.milestones = computeMilestones(state.jurisdictionKey, state.electionDate, state.role);
  renderTimeline(state.milestones, state, t);
  renderChecklist(state.milestones, t);
  renderQuiz(state.role, t);
  renderScenarios(t);
  renderExports(state.milestones, state, t);
  renderSources();
  
  saveState(); // Persist the final state
  
  document.getElementById("wizard-overlay").hidden = true;
  document.getElementById("main-nav").hidden = false;
  setSection("timeline");
}

function renderSources() {
  const container = document.getElementById("sources-container");
  if (!container) return;
  const juris = JURISDICTIONS[state.jurisdictionKey] || JURISDICTIONS.generic;
  container.innerHTML = `
    <h2 class="section-title">${t.sourcesTitle}</h2>
    <div class="disclaimer-banner" role="alert">
      <span class="disclaimer-icon">⚠️</span>
      <span>${t.sourcesNote}</span>
    </div>
    <div class="sources-list">
      <div class="source-item glass-card">
        <strong>Official Election Portal</strong>
        <a href="${juris.officialSite}" target="_blank" rel="noopener" class="resource-link">${juris.officialSite}</a>
        <span class="source-ts">Generated: ${new Date().toLocaleString()}</span>
      </div>
      <div class="source-item glass-card">
        <strong>U.S. Election Assistance Commission</strong>
        <a href="https://www.eac.gov" target="_blank" rel="noopener" class="resource-link">eac.gov</a>
      </div>
      <div class="source-item glass-card">
        <strong>vote.gov — Official U.S. Voting Resource</strong>
        <a href="https://vote.gov" target="_blank" rel="noopener" class="resource-link">vote.gov</a>
      </div>
      <div class="source-item glass-card">
        <strong>International IDEA — Global Election Data</strong>
        <a href="https://www.idea.int" target="_blank" rel="noopener" class="resource-link">idea.int</a>
      </div>
      <div class="source-item glass-card">
        <strong>National Conference of State Legislatures (NCSL)</strong>
        <a href="https://www.ncsl.org/elections-and-campaigns" target="_blank" rel="noopener" class="resource-link">ncsl.org</a>
      </div>
      <div class="source-item glass-card">
        <strong>Election Protection Hotline</strong>
        <a href="https://866ourvote.org" target="_blank" rel="noopener" class="resource-link">1-866-OUR-VOTE</a>
      </div>
    </div>
    <div class="followup-prompts glass-card">
      <h3>Copy-Paste Follow-Up Prompts</h3>
      <div class="prompt-list">
        ${[t.followUpQ1, t.followUpQ2, t.followUpQ3].map((q,i)=>`
          <div class="prompt-item" id="prompt-${i}">
            <span class="prompt-text">${q}</span>
            <button class="btn btn-ghost btn-small copy-prompt-btn" data-prompt="${q}" aria-label="Copy prompt">Copy</button>
          </div>`).join("")}
      </div>
    </div>`;

  container.querySelectorAll(".copy-prompt-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(btn.dataset.prompt).catch(()=>{});
      btn.textContent = "✓ Copied";
      setTimeout(() => btn.textContent = "Copy", 2000);
    });
  });
}

// ── Wizard ────────────────────────────────────────────────────────────────────
let wizardInitialized = false;

function buildWizard() {
  const overlay = document.getElementById("wizard-overlay");
  const stepContents = {
    "jurisdiction": `
      <div class="wizard-field">
        <label for="wiz-country">Country / Region</label>
        <select id="wiz-country" class="wiz-input">
          <option value="">— Select —</option>
          <option value="us">United States</option>
          <option value="in">India</option>
          <option value="uk">United Kingdom</option>
          <option value="other">Other / Generic</option>
        </select>
      </div>
      <div class="wizard-field">
        <label for="wiz-state">State / Province / Territory</label>
        <input type="text" id="wiz-state" class="wiz-input" placeholder="e.g. California, Maharashtra, England" />
      </div>
      <div class="wizard-field">
        <label for="wiz-county">County / City (optional)</label>
        <input type="text" id="wiz-county" class="wiz-input" placeholder="e.g. Los Angeles, Mumbai" />
      </div>`,
    "election-type": `
      <p class="wiz-sublabel">What type of election are you preparing for?</p>
      <div class="wiz-option-grid">
        ${[["general","🗳 General / National"],["primary","🔵 Primary"],["local","🏙 Local / Municipal"],["ballot_measure","📜 Ballot Measure / Referendum"]].map(([v,l])=>`
          <label class="wiz-option-card" for="et-${v}">
            <input type="radio" name="election-type" id="et-${v}" value="${v}" />
            <span>${l}</span>
          </label>`).join("")}
      </div>`,
    "election-date": `
      <p class="wiz-sublabel">Do you know your election date? (Optional — needed for exact deadlines)</p>
      <div class="wizard-field">
        <label for="wiz-date">Election Date</label>
        <input type="date" id="wiz-date" class="wiz-input" min="${new Date().toISOString().split('T')[0]}" />
      </div>
      <p class="wiz-hint">Leave blank to receive a generic timeline with estimated windows.</p>`,
    "role": `
      <p class="wiz-sublabel">Which best describes your role?</p>
      <div class="wiz-option-grid">
        ${[["voter","🗳 Voter"],["candidate","🎤 Candidate"],["poll_worker","📋 Poll Worker"],["campaign_staff","📣 Campaign Staff"],["educator","📚 Civic Educator"]].map(([v,l])=>`
          <label class="wiz-option-card" for="role-${v}">
            <input type="radio" name="role" id="role-${v}" value="${v}" ${v==="voter"?"checked":""} />
            <span>${l}</span>
          </label>`).join("")}
      </div>`,
    "voting-method": `
      <p class="wiz-sublabel">How do you plan to vote? (Select all that apply)</p>
      <div class="wiz-checkbox-list">
        ${[["in_person","🏛 In-Person on Election Day"],["early","📅 Early Voting"],["mail","✉️ Mail-In / Absentee"],["provisional","📝 Provisional Ballot"],["curbside","🚗 Curbside / Accessible Voting"]].map(([v,l])=>`
          <label class="wiz-checkbox-item" for="vm-${v}">
            <input type="checkbox" id="vm-${v}" value="${v}" class="wiz-checkbox vm-check" />
            <span>${l}</span>
          </label>`).join("")}
      </div>`,
    "accessibility": `
      <p class="wiz-sublabel">Preferences & Accessibility</p>
      <div class="wizard-field">
        <label for="wiz-lang">Language</label>
        <select id="wiz-lang" class="wiz-input">
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
        </select>
      </div>
      <div class="wizard-field">
        <label for="wiz-reg">Registration Status</label>
        <select id="wiz-reg" class="wiz-input">
          <option value="registered">Already Registered</option>
          <option value="need_reg">Need to Register</option>
          <option value="need_update">Need to Update Registration</option>
          <option value="unsure">Not Sure</option>
        </select>
      </div>
      <div class="wizard-field">
        <label for="wiz-level">Reading Level</label>
        <select id="wiz-level" class="wiz-input">
          <option value="default">Default (8th grade)</option>
          <option value="simple">Simpler (5th grade)</option>
          <option value="detailed">Detailed (with legal citations)</option>
        </select>
      </div>
      <div class="wizard-field">
        <label class="wiz-checkbox-item" for="wiz-contrast">
          <input type="checkbox" id="wiz-contrast" class="wiz-checkbox" />
          <span>High Contrast Mode</span>
        </label>
      </div>`
  };

  const stepLabels = ["Jurisdiction","Election Type","Election Date","Your Role","Voting Method","Accessibility"];

  function renderWizardStep() {
    const key = WIZARD_STEPS[wizardStep];
    const pct = Math.round(((wizardStep)/ WIZARD_STEPS.length)*100);
    overlay.querySelector("#wiz-step-label").textContent = `Step ${wizardStep+1} of ${WIZARD_STEPS.length}: ${stepLabels[wizardStep]}`;
    overlay.querySelector("#wiz-progress-fill").style.width = pct+"%";
    overlay.querySelector("#wiz-content").innerHTML = stepContents[key];
    overlay.querySelector("#wiz-back").hidden = wizardStep === 0;
    overlay.querySelector("#wiz-next").textContent = wizardStep === WIZARD_STEPS.length-1 ? "Generate My Timeline →" : "Next →";
    // Re-apply saved values
    if (key === "jurisdiction") {
      if (state.country) { const el=document.getElementById("wiz-country"); if(el) el.value=state.country; }
      if (state.stateProvince) { const el=document.getElementById("wiz-state"); if(el) el.value=state.stateProvince; }
      if (state.countyCity) { const el=document.getElementById("wiz-county"); if(el) el.value=state.countyCity; }
    }
  }

  function collectStep() {
    const key = WIZARD_STEPS[wizardStep];
    if (key === "jurisdiction") {
      state.country = document.getElementById("wiz-country")?.value || "";
      state.stateProvince = document.getElementById("wiz-state")?.value || "";
      state.countyCity = document.getElementById("wiz-county")?.value || "";
      // Map to jurisdiction key
      const c = state.country;
      state.jurisdictionKey = c==="us"?"us_national":c==="in"?"india_national":c==="uk"?"uk_national":"generic";
    } else if (key === "election-type") {
      const sel = document.querySelector('input[name="election-type"]:checked');
      state.electionType = sel?.value || "general";
    } else if (key === "election-date") {
      state.electionDate = document.getElementById("wiz-date")?.value || "";
    } else if (key === "role") {
      const sel = document.querySelector('input[name="role"]:checked');
      state.role = sel?.value || "voter";
    } else if (key === "voting-method") {
      state.votingMethod = [...document.querySelectorAll(".vm-check:checked")].map(c=>c.value).join(",");
    } else if (key === "accessibility") {
      state.lang = document.getElementById("wiz-lang")?.value || "en";
      state.regStatus = document.getElementById("wiz-reg")?.value || "registered";
      state.readingLevel = document.getElementById("wiz-level")?.value || "default";
      state.highContrast = document.getElementById("wiz-contrast")?.checked || false;
      if (state.highContrast) document.body.classList.add("high-contrast");
      document.documentElement.lang = state.lang;
    }
  }

  if (!wizardInitialized) {
    overlay.querySelector("#wiz-next").addEventListener("click", () => {
      collectStep();
      if (wizardStep < WIZARD_STEPS.length - 1) {
        wizardStep++;
        renderWizardStep();
      } else {
        showDashboard();
      }
    });

    overlay.querySelector("#wiz-back").addEventListener("click", () => {
      if (wizardStep > 0) { wizardStep--; renderWizardStep(); }
    });

    overlay.querySelector("#wiz-skip").addEventListener("click", () => {
      showDashboard();
    });
    
    wizardInitialized = true;
  }

  wizardStep = 0; // reset on open
  renderWizardStep();
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function initNav() {
  document.querySelectorAll(".nav-link").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      setSection(a.dataset.section);
    });
  });

  document.getElementById("nav-start-over")?.addEventListener("click", () => {
    if (confirm(getTranslations(state.lang).confirmReset || "Are you sure you want to start over? This will clear all your progress.")) {
      clearState();
      window.location.reload();
    }
  });
}

// ── Theme & Lang toggles ──────────────────────────────────────────────────────
function initToggles() {
  const contrastBtn = document.getElementById("contrast-btn");
  if (contrastBtn) {
    contrastBtn.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      state.highContrast = !state.highContrast;
    });
  }

  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      state.lang = langSelect.value;
      document.documentElement.lang = state.lang;
      if (state.milestones.length > 0) {
        t = getT();
        renderTimeline(state.milestones, state, t);
        renderChecklist(state.milestones, t);
        renderQuiz(state.role, t);
        renderScenarios(t);
        renderExports(state.milestones, state, t);
        renderSources();
      }
    });
  }
}

// ── Hero CTA ──────────────────────────────────────────────────────────────────
function initHero() {
  document.getElementById("cta-start")?.addEventListener("click", () => {
    document.getElementById("wizard-overlay").hidden = false;
    buildWizard();
  });
  document.getElementById("cta-learn")?.addEventListener("click", () => {
    state.jurisdictionKey = "generic";
    state.electionDate = "";
    state.role = "voter";
    showDashboard();
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("main-nav").hidden = true;
  initNav();
  initToggles();

  // Load saved state or start wizard
  const savedState = loadState();
  if (savedState && savedState.jurisdictionKey) {
    Object.assign(state, savedState);
    if (state.highContrast) document.body.classList.add("high-contrast");
    document.documentElement.lang = state.lang;
    showDashboard();
  } else {
    initHero();
  }

  // Register Service Worker for PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(err => {
        console.warn("Service worker registration failed:", err);
      });
    });
  }
});
