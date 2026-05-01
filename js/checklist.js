/**
 * checklist.js
 * Renders interactive checklist from milestone data.
 * Persists state in localStorage.
 */

const CHECKLIST_KEY = "electwise_checklist";

function buildChecklistItems(milestones) {
  const items = [];
  let id = 1;
  milestones.forEach((m) => {
    m.actions.forEach((action) => {
      items.push({
        id: `cl_${id++}`,
        milestoneId: m.id,
        milestoneTitle: m.title,
        task: action,
        estimatedMinutes: estimateTime(action),
        requiredDocuments: m.documents || [],
        priority: m.priority,
      });
    });
  });
  return items;
}

function estimateTime(action) {
  const lower = action.toLowerCase();
  if (lower.includes("register") || lower.includes("application") || lower.includes("apply")) return 10;
  if (lower.includes("download") || lower.includes("print") || lower.includes("copy")) return 5;
  if (lower.includes("contact") || lower.includes("call")) return 15;
  if (lower.includes("compile") || lower.includes("file") || lower.includes("report")) return 30;
  return 5;
}

function loadCheckedState() {
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCheckedState(state) {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
  } catch {}
}

function renderChecklist(milestones, t) {
  const container = document.getElementById("checklist-container");
  if (!container) return;

  const items = buildChecklistItems(milestones);
  const checked = loadCheckedState();
  const completedCount = items.filter((i) => checked[i.id]).length;
  const pct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  let html = `
    <div class="checklist-header">
      <h2 class="section-title">${t.checklistTitle}</h2>
      <button class="btn btn-ghost" id="print-checklist-btn" onclick="window.print()" aria-label="${t.checklistPrint}">
        ${t.checklistPrint}
      </button>
    </div>
    <div class="progress-bar-wrap" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Checklist progress">
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width:${pct}%" id="checklist-progress-fill"></div>
      </div>
      <span class="progress-label" id="checklist-progress-label">${completedCount} / ${items.length} ${t.checklistProgress}</span>
    </div>
    <ol class="checklist-list" id="checklist-list">`;

  // Group by milestone
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.milestoneId]) grouped[item.milestoneId] = { title: item.milestoneTitle, priority: item.priority, items: [] };
    grouped[item.milestoneId].items.push(item);
  });

  Object.values(grouped).forEach((group) => {
    html += `<li class="checklist-group">
      <div class="checklist-group-header">
        <span class="checklist-group-title">${group.title}</span>
        <span class="priority-chip priority-${group.priority.toLowerCase()}">${group.priority}</span>
      </div>
      <ul class="checklist-sub-list">`;

    group.items.forEach((item) => {
      const isChecked = !!checked[item.id];
      html += `
        <li class="checklist-item ${isChecked ? "checked" : ""}" data-item-id="${item.id}">
          <label class="checklist-label" for="cl_${item.id}">
            <input type="checkbox" id="cl_${item.id}" class="checklist-checkbox" data-item-id="${item.id}"
              ${isChecked ? "checked" : ""} aria-label="${item.task}" />
            <span class="checklist-checkmark"></span>
            <span class="checklist-text">${item.task}</span>
          </label>
          <div class="checklist-meta">
            <span class="checklist-time">⏱ ~${item.estimatedMinutes} min</span>
            ${item.requiredDocuments.length > 0 ? `<span class="checklist-docs-hint">📄 ${item.requiredDocuments.join(", ")}</span>` : ""}
          </div>
        </li>`;
    });

    html += `</ul></li>`;
  });

  html += `</ol>`;
  container.innerHTML = html;

  // Attach event listeners
  container.querySelectorAll(".checklist-checkbox").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const itemId = e.target.dataset.itemId;
      const newChecked = loadCheckedState();
      newChecked[itemId] = e.target.checked;
      saveCheckedState(newChecked);

      // Update UI
      const li = container.querySelector(`.checklist-item[data-item-id="${itemId}"]`);
      if (li) li.classList.toggle("checked", e.target.checked);

      // Recompute progress
      const allItems = container.querySelectorAll(".checklist-checkbox");
      const nowChecked = container.querySelectorAll(".checklist-checkbox:checked").length;
      const newPct = allItems.length > 0 ? Math.round((nowChecked / allItems.length) * 100) : 0;
      const fill = document.getElementById("checklist-progress-fill");
      const label = document.getElementById("checklist-progress-label");
      if (fill) fill.style.width = newPct + "%";
      if (label) label.textContent = `${nowChecked} / ${allItems.length} ${t.checklistProgress}`;
    });
  });
}

export { renderChecklist, buildChecklistItems };
