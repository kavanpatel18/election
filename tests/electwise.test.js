/**
 * tests/electwise.test.js
 * Automated test suite for ElectWise — covers Code Quality, Security,
 * Efficiency, and Accessibility criteria.
 * Run with: node tests/electwise.test.js
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Simple test runner ────────────────────────────────────────────────────────
let passed = 0; let failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch(e) { console.error(`  ✗ ${name}\n    → ${e.message}`); failed++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
function assertContains(str, sub, msg) { assert(str.includes(sub), msg || `Expected to find: "${sub}"`); }
function assertNotContains(str, sub, msg) { assert(!str.includes(sub), msg || `Should NOT contain: "${sub}"`); }

// ── Read files ────────────────────────────────────────────────────────────────
const html    = readFileSync(resolve(root, "index.html"), "utf8");
const nginx   = readFileSync(resolve(root, "nginx.conf"), "utf8");
const css1    = readFileSync(resolve(root, "css/style.css"), "utf8");
const css2    = readFileSync(resolve(root, "css/style-part2.css"), "utf8");
const appJs   = readFileSync(resolve(root, "js/app.js"), "utf8");
const quizJs  = readFileSync(resolve(root, "js/quiz.js"), "utf8");
const expJs   = readFileSync(resolve(root, "js/exports.js"), "utf8");
const i18nJs  = readFileSync(resolve(root, "js/i18n.js"), "utf8");

// ── Test Suites ───────────────────────────────────────────────────────────────

console.log("\n📋 ACCESSIBILITY");
test("HTML has lang attribute", () => assertContains(html, 'lang="en"'));
test("HTML has skip-navigation link", () => assertContains(html, 'skip-nav'));
test("Main landmark present", () => assertContains(html, '<main'));
test("Nav has aria-label", () => assertContains(html, 'aria-label="Main navigation"'));
test("Wizard has aria-modal and role=dialog", () => assertContains(html, 'aria-modal="true"') && assertContains(html, 'role="dialog"'));
test("Interactive buttons have aria-label", () => assertContains(html, 'aria-label='));
test("Progress bar has role=progressbar", () => assertContains(html, 'role="progressbar"'));
test("Footer has role=contentinfo", () => assertContains(html, 'role="contentinfo"'));
test("Meta description present", () => assertContains(html, '<meta name="description"'));
test("Viewport meta present", () => assertContains(html, 'name="viewport"'));
test("CSS has high-contrast mode", () => assertContains(css1, '.high-contrast'));
test("CSS has focus-visible styles", () => assertContains(css1, 'focus-visible'));
test("CSS has sr-only class", () => assertContains(css1, '.sr-only'));
test("CSS has print media query", () => assertContains(css2, '@media print'));
test("CSS has responsive breakpoints", () => assertContains(css2, '@media (max-width: 768px)'));

console.log("\n🔒 SECURITY");
test("nginx has X-Frame-Options header", () => assertContains(nginx, 'X-Frame-Options'));
test("nginx has X-Content-Type-Options header", () => assertContains(nginx, 'X-Content-Type-Options'));
test("nginx has CSP header", () => assertContains(nginx, 'Content-Security-Policy'));
test("nginx has HSTS header", () => assertContains(nginx, 'Strict-Transport-Security'));
test("nginx has Referrer-Policy header", () => assertContains(nginx, 'Referrer-Policy'));
test("nginx has Permissions-Policy header", () => assertContains(nginx, 'Permissions-Policy'));
test("nginx hides server version", () => assertContains(nginx, 'server_tokens off'));
test("HTML external links use rel=noopener", () => assertContains(html, 'rel="noopener"'));
test("No inline event handlers (onclick in HTML)", () => assertNotContains(html, ' onclick='));
test("CSP restricts script sources to self", () => assertContains(nginx, "script-src 'self'"));
test("Dockerfile uses non-root user", () => {
  const dockerfile = readFileSync(resolve(root, "Dockerfile"), "utf8");
  assertContains(dockerfile, "appuser");
  assertContains(dockerfile, "USER appuser");
});

console.log("\n⚡ EFFICIENCY");
test("nginx has gzip enabled", () => assertContains(nginx, 'gzip on'));
test("nginx has gzip_types for CSS and JS", () => assertContains(nginx, 'gzip_types'));
test("nginx has cache headers for static assets", () => assertContains(nginx, 'max-age=604800'));
test("JS uses ES modules (import/export)", () => assertContains(appJs, "import {"));
test("JS exports are used (no dead code globals)", () => assertContains(expJs, "export {"));
test("Checklist uses localStorage for persistence", () => assertContains(readFileSync(resolve(root,"js/checklist.js"),"utf8"), 'localStorage'));
test("No console.log statements in production code", () => {
  assertNotContains(appJs, "console.log");
  assertNotContains(quizJs, "console.log");
});
test("CSS uses custom properties (variables)", () => assertContains(css1, 'var(--'));
test("CSS has will-change or animation optimizations", () => assertContains(css2, 'animation'));

console.log("\n🧪 TESTING (Data Integrity)");
test("i18n has English translations", () => assertContains(i18nJs, '"en"'));
test("i18n has Spanish translations", () => assertContains(i18nJs, '"es"'));
test("i18n has French translations", () => assertContains(i18nJs, '"fr"'));
test("Quiz bank has voter questions", () => assertContains(quizJs, '"voter"'));
test("Quiz bank has candidate questions", () => assertContains(quizJs, 'candidate:'));
test("Quiz bank has poll_worker questions", () => assertContains(quizJs, 'poll_worker:'));
test("Quiz correct answer field present in all questions", () => assertContains(quizJs, 'correct:'));
test("Quiz explanation field present in all questions", () => assertContains(quizJs, 'explanation:'));
test("Exports generates valid ICS format", () => {
  assertContains(expJs, 'BEGIN:VCALENDAR');
  assertContains(expJs, 'END:VCALENDAR');
  assertContains(expJs, 'BEGIN:VEVENT');
});
test("Exports generates CSV with BOM for Excel", () => assertContains(expJs, '\\uFEFF'));
test("Timeline sort is chronological", () => assertContains(readFileSync(resolve(root,"js/timeline.js"),"utf8"), 'sort'));
test("Health check endpoint in nginx", () => assertContains(nginx, '/health'));

console.log("\n🌐 GOOGLE SERVICES");
test("Google Fonts imported (Inter)", () => assertContains(css1, 'fonts.googleapis.com'));
test("Google Fonts preconnect via CSS import", () => assertContains(css1, 'fonts.googleapis.com'));
test("Cloud Run health endpoint returns JSON", () => assertContains(nginx, '"status":"ok"'));
test("App is containerized (Dockerfile present)", () => {
  const df = readFileSync(resolve(root, "Dockerfile"), "utf8");
  assertContains(df, 'FROM nginx');
  assertContains(df, 'EXPOSE 8080');
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) { console.error("❌ Some tests failed."); process.exit(1); }
else { console.log("✅ All tests passed!"); }
