/**
 * scenarios.js
 * "What If Something Goes Wrong?" — stepwise decision tree flows.
 */

const SCENARIOS = [
  {
    id: "missed_registration",
    icon: "📋",
    title: "I missed the voter registration deadline.",
    steps: [
      {
        heading: "Step 1 — Check if your state offers same-day registration",
        body: "Many states (and some countries) allow you to register and vote on election day itself. Visit your official state election website immediately to check.",
        links: [{ label: "Check Same-Day Registration by State — NCSL", url: "https://www.ncsl.org/elections-and-campaigns/same-day-voter-registration" }],
      },
      {
        heading: "Step 2 — Check if the deadline has truly passed",
        body: "Deadlines are sometimes extended by court order, especially close to election day. Check your state election website and local news for any deadline changes.",
        links: [{ label: "Your State Election Office", url: "https://www.vote.gov/register-to-vote/" }],
      },
      {
        heading: "Step 3 — Ask about provisional ballot options",
        body: "Even if you are not registered, go to your polling place and ask about a provisional ballot. In some jurisdictions, provisional ballots are counted for certain races even if full registration is incomplete.",
        links: [{ label: "Provisional Voting — EAC", url: "https://www.eac.gov/voters/provisional-voting" }],
      },
      {
        heading: "Step 4 — Register for the next election now",
        body: "Use this as a learning moment. Register for the next election well in advance at vote.gov or your jurisdiction's official portal.",
        links: [{ label: "Register Now — vote.gov", url: "https://vote.gov/register-to-vote/" }],
      },
    ],
  },
  {
    id: "ballot_not_received",
    icon: "✉️",
    title: "I requested a mail-in ballot but it never arrived.",
    steps: [
      {
        heading: "Step 1 — Track your ballot",
        body: "Use your jurisdiction's ballot tracking system or USPS Informed Delivery to check the status of your ballot in the mail.",
        links: [
          { label: "BallotTrax — Ballot Tracking", url: "https://ballottrax.com" },
          { label: "USPS Informed Delivery", url: "https://informeddelivery.usps.com" },
        ],
      },
      {
        heading: "Step 2 — Contact your county election office immediately",
        body: "Call or email your county clerk or election office. They can confirm whether your ballot was sent and may be able to issue a replacement ballot.",
        links: [{ label: "Find Your County Election Office", url: "https://www.usvotefoundation.org/state-election-offices" }],
      },
      {
        heading: "Step 3 — Request a replacement ballot (if time permits)",
        body: "Many jurisdictions allow you to request a replacement ballot if yours was lost or not received. There is typically a deadline for replacement requests — act fast.",
        links: [{ label: "Absentee Ballot Replacement Info — vote.gov", url: "https://vote.gov/absentee-voting/" }],
      },
      {
        heading: "Step 4 — Vote in person on election day using a provisional ballot",
        body: "If no replacement ballot is available in time, go to your polling place on election day and cast a provisional ballot. Bring your mail ballot if you have it (even if blank), to surrender it.",
        links: [{ label: "Provisional Ballot Information — EAC", url: "https://www.eac.gov/voters/provisional-voting" }],
      },
    ],
  },
  {
    id: "name_mismatch",
    icon: "🪪",
    title: "There is a name mismatch at the polling place.",
    steps: [
      {
        heading: "Step 1 — Stay calm and ask the poll worker to double-check",
        body: "Ask the poll worker to check for alternate spellings, maiden names, or hyphenated names. Clerical errors are common — a supervisor may be able to verify your identity.",
        links: [],
      },
      {
        heading: "Step 2 — Show additional identification",
        body: "Present any additional ID you have — utility bills, bank statements, or other documents showing your registered name and address. Requirements vary by jurisdiction.",
        links: [{ label: "Voter ID Laws by State — NCSL", url: "https://www.ncsl.org/elections-and-campaigns/voter-id" }],
      },
      {
        heading: "Step 3 — Request a provisional ballot",
        body: "You have the right to cast a provisional ballot even if your name cannot be immediately confirmed. The ballot will be reviewed and counted after election officials verify your eligibility.",
        links: [{ label: "Your Right to a Provisional Ballot — EAC", url: "https://www.eac.gov/voters/provisional-voting" }],
      },
      {
        heading: "Step 4 — Contact a nonpartisan voter protection hotline",
        body: "If you believe your voting rights are being violated, call the nonpartisan Election Protection Hotline immediately from the polling place.",
        links: [
          { label: "Election Protection Hotline: 1-866-OUR-VOTE", url: "https://866ourvote.org" },
          { label: "DOJ Voting Rights Complaints", url: "https://www.justice.gov/crt/voting-section" },
        ],
      },
    ],
  },
  {
    id: "polling_place_closed",
    icon: "🏫",
    title: "My polling place is closed or has moved.",
    steps: [
      {
        heading: "Step 1 — Confirm your polling place before election day",
        body: "Polling places sometimes change. Always verify your assigned location at your official state or county election website — do not rely solely on your polling card.",
        links: [{ label: "Find Your Polling Place — vote.gov", url: "https://vote.gov/find-your-polling-place/" }],
      },
      {
        heading: "Step 2 — On election day: contact your county election office",
        body: "If your polling place appears closed or inaccessible, call your county election office immediately for the correct current location.",
        links: [{ label: "Find Your County Election Office", url: "https://www.usvotefoundation.org/state-election-offices" }],
      },
      {
        heading: "Step 3 — Ask about emergency or alternative voting options",
        body: "Some jurisdictions allow you to vote at any polling place in your county on election day if yours is inaccessible (called 'vote centers'). Ask your election office.",
        links: [],
      },
      {
        heading: "Step 4 — Document and report the closure",
        body: "Take photos or notes about the closure. Report it to your election office and the Election Protection Hotline. This helps protect other voters.",
        links: [{ label: "Report Voting Problems — 866ourvote.org", url: "https://866ourvote.org" }],
      },
    ],
  },
  {
    id: "provisional_ballot",
    icon: "📝",
    title: "I was given a provisional ballot — what happens next?",
    steps: [
      {
        heading: "Step 1 — Understand why you received a provisional ballot",
        body: "Provisional ballots are given when your eligibility cannot be immediately confirmed: name not on roll, ID issues, address discrepancies, or you requested a mail ballot. Your ballot is set aside until officials verify your eligibility.",
        links: [{ label: "Provisional Ballot FAQ — EAC", url: "https://www.eac.gov/voters/provisional-voting" }],
      },
      {
        heading: "Step 2 — Complete and seal the ballot envelope correctly",
        body: "Fill out ALL required information on the provisional ballot envelope — your name, address, signature, and reason for provisional ballot. Incomplete envelopes may result in your ballot not being counted.",
        links: [],
      },
      {
        heading: "Step 3 — Provide any required additional documentation",
        body: "Some jurisdictions require you to provide additional documentation (such as a copy of your ID) to your election office within a few days after election day for your provisional ballot to be counted. Ask the poll worker for the exact deadline and process.",
        links: [{ label: "Check Your State Requirements — NCSL", url: "https://www.ncsl.org/elections-and-campaigns/provisional-ballots" }],
      },
      {
        heading: "Step 4 — Track your provisional ballot",
        body: "Many states allow you to check whether your provisional ballot was counted online after election day. You will receive a receipt with a tracking number — keep it.",
        links: [{ label: "Check Provisional Ballot Status", url: "https://www.vote.gov/absentee-voting/" }],
      },
      {
        heading: "Step 5 — Contact your election office if your ballot was not counted",
        body: "If you believe your ballot was wrongly rejected, contact your county election office to understand the reason and whether an appeal or cure process is available.",
        links: [{ label: "Find Your Election Office", url: "https://www.usvotefoundation.org/state-election-offices" }],
      },
    ],
  },
];

function renderScenarios(t) {
  const container = document.getElementById("scenarios-container");
  if (!container) return;

  let html = `<h2 class="section-title">${t.scenariosTitle}</h2>
    <p class="section-subtitle">Select a situation below for step-by-step guidance.</p>
    <div class="scenarios-list">`;

  SCENARIOS.forEach((s) => {
    html += `
      <details class="scenario-card glass-card" id="scenario-${s.id}">
        <summary class="scenario-summary" role="button" aria-expanded="false">
          <span class="scenario-icon">${s.icon}</span>
          <span class="scenario-title">${s.title}</span>
          <span class="scenario-chevron">›</span>
        </summary>
        <div class="scenario-body">
          ${s.steps
            .map(
              (step, i) => `
            <div class="scenario-step">
              <div class="step-number">${i + 1}</div>
              <div class="step-content">
                <h4 class="step-heading">${step.heading}</h4>
                <p class="step-body">${step.body}</p>
                ${
                  step.links.length > 0
                    ? `<ul class="step-links">
                    ${step.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer" class="resource-link">🔗 ${l.label}</a></li>`).join("")}
                  </ul>`
                    : ""
                }
              </div>
            </div>`
            )
            .join("")}
        </div>
      </details>`;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Animate chevron on open/close and update aria-expanded
  container.querySelectorAll(".scenario-card").forEach((el) => {
    el.addEventListener("toggle", () => {
      const chevron = el.querySelector(".scenario-chevron");
      const summary = el.querySelector(".scenario-summary");
      if (chevron) chevron.style.transform = el.open ? "rotate(90deg)" : "rotate(0deg)";
      if (summary) summary.setAttribute("aria-expanded", el.open ? "true" : "false");
    });
  });
}

export { renderScenarios, SCENARIOS };
