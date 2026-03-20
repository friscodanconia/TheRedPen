// ============================================================
// THE RED PEN — LinkedIn Chrome Extension
// Injects AI score badge into LinkedIn compose boxes
// ============================================================

(function () {
  "use strict";

  const BADGE_ID = "redpen-badge";
  const PANEL_ID = "redpen-panel";
  let debounceTimer = null;

  // Watch for LinkedIn compose editors
  const observer = new MutationObserver(() => {
    const editors = document.querySelectorAll(
      '.ql-editor[contenteditable="true"], [role="textbox"][contenteditable="true"]'
    );
    editors.forEach(attachToEditor);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also check on load
  setTimeout(() => {
    const editors = document.querySelectorAll(
      '.ql-editor[contenteditable="true"], [role="textbox"][contenteditable="true"]'
    );
    editors.forEach(attachToEditor);
  }, 2000);

  function attachToEditor(editorEl) {
    if (editorEl.dataset.redpenAttached) return;
    editorEl.dataset.redpenAttached = "true";

    // Create badge
    const badge = document.createElement("div");
    badge.id = BADGE_ID;
    badge.className = "redpen-badge";
    badge.innerHTML = `<span class="redpen-score">—</span>`;
    badge.title = "The Red Pen — AI Score";

    // Position badge near the editor
    const parent = editorEl.closest(".share-box, .comments-comment-texteditor, .feed-shared-update-v2__commentary-container") || editorEl.parentElement;
    if (parent) {
      parent.style.position = "relative";
      parent.appendChild(badge);
    }

    // Create findings panel (hidden by default)
    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.className = "redpen-panel redpen-hidden";
    if (parent) parent.appendChild(panel);

    // Toggle panel on badge click
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("redpen-hidden");
    });

    // Listen for input
    editorEl.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = editorEl.innerText || editorEl.textContent || "";
        updateBadge(text, badge, panel);
      }, 500);
    });

    // Initial check
    const initialText = editorEl.innerText || editorEl.textContent || "";
    if (initialText.trim().length > 20) {
      updateBadge(initialText, badge, panel);
    }
  }

  function updateBadge(text, badge, panel) {
    const trimmed = text.trim();
    if (trimmed.split(/\s+/).length < 20) {
      badge.querySelector(".redpen-score").textContent = "—";
      badge.className = "redpen-badge";
      panel.innerHTML = "";
      panel.classList.add("redpen-hidden");
      return;
    }

    const result = analyze(trimmed);
    const score = result.aiScore;

    // Update badge
    const scoreEl = badge.querySelector(".redpen-score");
    scoreEl.textContent = score;
    badge.className = "redpen-badge" +
      (score > 55 ? " redpen-bad" : score > 25 ? " redpen-warn" : " redpen-good");

    // Update panel
    let html = `<div class="redpen-panel-header">
      <strong>AI Score: ${score}/100</strong>
      <span class="redpen-verdict">${
        score <= 10 ? "Sounds human" :
        score <= 25 ? "A few AI-associated patterns" :
        score <= 45 ? "Noticeable AI patterns" :
        score <= 65 ? "Many AI-associated patterns" :
        score <= 85 ? "Heavy pattern density" : "Very high pattern density"
      }</span>
    </div>`;

    if (result.phraseHits.length > 0) {
      html += `<div class="redpen-panel-section">`;
      result.phraseHits.slice(0, 8).forEach(hit => {
        html += `<div class="redpen-hit">
          <span class="redpen-phrase">'${hit.text}'</span>
          <span class="redpen-count">${hit.count}x</span>
          ${hit.replacement ? `<span class="redpen-replace">→ ${hit.replacement.split(",")[0].replace(/^\[/, "").trim()}</span>` : ""}
        </div>`;
      });
      if (result.phraseHits.length > 8) {
        html += `<div class="redpen-more">+${result.phraseHits.length - 8} more patterns</div>`;
      }
      html += `</div>`;
    }

    const activeStructures = Object.values(result.structures).filter(s => s.matches.length > 0);
    if (activeStructures.length > 0) {
      html += `<div class="redpen-panel-section">`;
      activeStructures.forEach(s => {
        html += `<div class="redpen-hit"><span class="redpen-phrase">${s.label}</span> <span class="redpen-count">${s.matches.length}</span></div>`;
      });
      html += `</div>`;
    }

    html += `<div class="redpen-footer">The Red Pen — all analysis runs locally</div>`;
    panel.innerHTML = html;
  }
})();
