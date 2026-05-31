/**
 * Gera o currículo em PDF (PT e EN) a partir do MESMO conteúdo do site
 * (src/content/*.json). Assim o CV nunca fica desatualizado em relação ao site.
 *
 * Como usar:
 *   node scripts/generate-cv.mjs        # gera os HTMLs em /tmp e imprime via Chrome
 *
 * Requer o Google Chrome instalado (usado em modo headless para imprimir o PDF).
 * Saída: public/Rodrigo-Krug-CV.pdf (PT) e public/Rodrigo-Krug-Resume-EN.pdf (EN)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const read = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));

const profile = read("src/content/profile.json");
const experience = read("src/content/experience.json");
const awards = read("src/content/awards.json");

const T = {
  pt: {
    summary: "Resumo",
    experience: "Experiência",
    education: "Formação",
    skills: "Competências",
    awards: "Prêmios & Reconhecimentos",
    languages: "Idiomas",
    present: "Atual",
    langs: "Português (nativo) · Inglês (profissional pleno) · Espanhol (básico)",
  },
  en: {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    awards: "Awards & Recognition",
    languages: "Languages",
    present: "Present",
    langs: "Portuguese (native) · English (full professional) · Spanish (basic)",
  },
};

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function buildHtml(lang) {
  const t = T[lang];
  const summary = profile.intro[lang];
  const role = profile.role[lang];

  const jobs = experience.jobs
    .map((j) => {
      const ach =
        j.achievements && j.achievements.length
          ? `<ul>${j.achievements.map((a) => `<li>${esc(a[lang])}</li>`).join("")}</ul>`
          : "";
      return `
      <div class="item">
        <div class="item-head">
          <span class="item-title">${esc(j.role[lang])}</span>
          <span class="item-date">${esc(j.period[lang])}</span>
        </div>
        <div class="item-sub">${esc(j.company)} · ${esc(j.location[lang])}</div>
        <p class="item-desc">${esc(j.description[lang])}</p>
        ${ach}
      </div>`;
    })
    .join("");

  const edu = experience.education
    .map(
      (e) => `
      <div class="edu">
        <span class="edu-degree">${esc(e.degree[lang])}</span>
        <span class="edu-meta">${esc(e.institution)} · ${esc(e.period)}</span>
      </div>`,
    )
    .join("");

  const skills = experience.skillGroups
    .map(
      (g) => `
      <div class="skillgroup">
        <div class="skillgroup-title">${esc(g.title[lang])}</div>
        <div class="chips">${g.items.map((i) => `<span class="chip">${esc(i[lang])}</span>`).join("")}</div>
      </div>`,
    )
    .join("");

  const awardItems = awards.items
    .map(
      (a) =>
        `<li><strong>${esc(a.title[lang])}</strong>${a.issuer ? ` — ${esc(a.issuer)}` : ""} <span class="award-year">(${esc(a.year)})</span></li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="${lang === "pt" ? "pt-BR" : "en"}">
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #1e293b; font-size: 10.2pt; line-height: 1.5; margin: 0;
  }
  .name { font-size: 24pt; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; }
  .role {
    font-size: 11.5pt; font-weight: 700; margin-top: 2px;
    background: linear-gradient(100deg,#6366f1,#8b5cf6 45%,#d946ef);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .contact { font-size: 9pt; color: #475569; margin-top: 6px; }
  .contact a { color: #475569; text-decoration: none; }
  .rule { height: 3px; border-radius: 3px; margin: 12px 0 16px;
    background: linear-gradient(100deg,#6366f1,#8b5cf6 45%,#d946ef); }
  h2 {
    font-size: 9.5pt; text-transform: uppercase; letter-spacing: 0.12em;
    color: #6d28d9; margin: 16px 0 8px; font-weight: 700;
  }
  .summary { color: #334155; }
  .item { margin-bottom: 11px; page-break-inside: avoid; }
  .item-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .item-title { font-weight: 700; color: #0f172a; font-size: 10.6pt; }
  .item-date { font-size: 8.6pt; font-weight: 600; color: #7c3aed; white-space: nowrap; }
  .item-sub { font-size: 9.2pt; color: #475569; font-weight: 600; }
  .item-desc { margin: 3px 0 4px; color: #334155; }
  .item ul { margin: 3px 0 0; padding-left: 16px; }
  .item li { margin-bottom: 2px; color: #334155; }
  .edu { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
  .edu-degree { font-weight: 600; color: #0f172a; }
  .edu-meta { font-size: 9pt; color: #64748b; white-space: nowrap; }
  .skillgroup { margin-bottom: 8px; }
  .skillgroup-title { font-size: 8.4pt; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 6px; padding: 2px 7px; font-size: 8.6pt; color: #334155; }
  .awards { margin: 0; padding-left: 16px; }
  .awards li { margin-bottom: 3px; }
  .award-year { color: #7c3aed; font-weight: 600; }
  .langs { color: #334155; }
  .grid { display: grid; grid-template-columns: 1fr; gap: 0; }
</style>
</head>
<body>
  <div class="name">${esc(profile.name)}</div>
  <div class="role">${esc(role)}</div>
  <div class="contact">
    ${esc(profile.location[lang])} &nbsp;·&nbsp;
    <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> &nbsp;·&nbsp;
    linkedin.com/in/rodrigo-krug &nbsp;·&nbsp; rodrigokrug.com.br
  </div>
  <div class="rule"></div>

  <h2>${t.summary}</h2>
  <p class="summary">${esc(summary)}</p>

  <h2>${t.experience}</h2>
  ${jobs}

  <h2>${t.skills}</h2>
  ${skills}

  <h2>${t.education}</h2>
  ${edu}

  <h2>${t.awards}</h2>
  <ul class="awards">${awardItems}</ul>

  <h2>${t.languages}</h2>
  <p class="langs">${t.langs}</p>
</body>
</html>`;
}

// Localiza o binário do Chrome (macOS).
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

mkdirSync(resolve(root, "public"), { recursive: true });

const outputs = [
  { lang: "pt", pdf: "public/Rodrigo-Krug-CV.pdf" },
  { lang: "en", pdf: "public/Rodrigo-Krug-Resume-EN.pdf" },
];

for (const { lang, pdf } of outputs) {
  const html = buildHtml(lang);
  const htmlPath = `/tmp/cv-${lang}.html`;
  writeFileSync(htmlPath, html, "utf8");
  const outPath = resolve(root, pdf);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: "pipe" },
  );
  console.log(`OK ${lang} -> ${pdf}`);
}
console.log("DONE");
