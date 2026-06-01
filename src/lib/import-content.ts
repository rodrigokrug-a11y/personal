/**
 * Validação e normalização do JSON colado na página /importar.
 * Funções puras (sem I/O) — fáceis de testar. O endpoint /api/importar usa
 * isto para validar antes de commitar no GitHub.
 */

export type ContentKind = "blog" | "projeto";

export interface ImportResult {
  ok: boolean;
  kind?: ContentKind;
  slug?: string;
  path?: string; // caminho no repo, ex.: src/content/blog/meu-artigo.json
  data?: Record<string, unknown>;
  error?: string;
}

/** Remove acentos e transforma em slug-amigável-de-url. */
export function slugify(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Detecta se o JSON é de blog ou de projeto pelo formato dos campos. */
function detectKind(o: Record<string, unknown>): ContentKind | null {
  if (typeof o.title === "string" && ("date" in o || "titleEn" in o)) return "blog";
  if (typeof o.name === "string" && ("tagline" in o || "role" in o)) return "projeto";
  // fallbacks
  if ("excerpt" in o) return "blog";
  if ("metrics" in o || "year" in o) return "projeto";
  return null;
}

function isLocalized(v: unknown): boolean {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Record<string, unknown>).pt === "string" &&
    typeof (v as Record<string, unknown>).en === "string"
  );
}

/**
 * Valida e normaliza o texto colado. Retorna o objeto pronto para gravar,
 * o tipo (blog/projeto), o slug e o caminho no repositório.
 */
export function validateImport(
  raw: string,
  forcedKind?: ContentKind,
): ImportResult {
  let o: Record<string, unknown>;
  try {
    o = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: "O texto não é um JSON válido. Cole o JSON completo gerado pelo prompt (começa com { e termina com })." };
  }
  if (!o || typeof o !== "object" || Array.isArray(o)) {
    return { ok: false, error: "O JSON precisa ser um objeto único { ... }." };
  }

  const kind = forcedKind || detectKind(o);
  if (!kind) {
    return { ok: false, error: "Não consegui identificar se é um artigo (blog) ou um projeto. Verifique se o JSON tem os campos certos." };
  }

  // Detecta o erro clássico de corpo duplo-codificado (JSON dentro do JSON).
  for (const key of ["bodyPt", "bodyEn"]) {
    const v = o[key];
    if (typeof v === "string" && /^\s*"?body(Pt|En)"?\s*:/.test(v)) {
      return { ok: false, error: `O campo "${key}" parece ter um JSON colado dentro dele. Cole o JSON inteiro de uma vez (não cole o JSON dentro de um campo).` };
    }
  }

  if (kind === "blog") {
    if (typeof o.title !== "string" || !o.title.trim())
      return { ok: false, error: 'Artigo sem "title". Verifique o JSON.' };
    if (!isLocalized(o.excerpt))
      return { ok: false, error: 'Artigo precisa de "excerpt" com {pt, en}.' };
    if (typeof o.bodyPt !== "string" || typeof o.bodyEn !== "string")
      return { ok: false, error: 'Artigo precisa de "bodyPt" e "bodyEn" como texto (markdown).' };

    // defaults seguros
    const normalized = {
      title: o.title,
      titleEn: typeof o.titleEn === "string" ? o.titleEn : o.title,
      date: typeof o.date === "string" && o.date ? o.date : "",
      draft: o.draft === true,
      featured: o.featured === true,
      gradient:
        typeof o.gradient === "string" && o.gradient.startsWith("linear-gradient")
          ? o.gradient
          : "linear-gradient(135deg,#0ea5e9,#3b82f6 45%,#6366f1)",
      cover: typeof o.cover === "string" ? o.cover : null,
      excerpt: o.excerpt,
      tags: Array.isArray(o.tags) ? o.tags.filter((t) => typeof t === "string") : [],
      bodyPt: o.bodyPt,
      bodyEn: o.bodyEn,
    };
    const slug = slugify(String(o.slug || o.title));
    return { ok: true, kind, slug, path: `src/content/blog/${slug}.json`, data: normalized };
  }

  // projeto
  if (typeof o.name !== "string" || !o.name.trim())
    return { ok: false, error: 'Projeto sem "name". Verifique o JSON.' };
  if (!isLocalized(o.tagline) || !isLocalized(o.description))
    return { ok: false, error: 'Projeto precisa de "tagline" e "description" com {pt, en}.' };
  if (typeof o.bodyPt !== "string" || typeof o.bodyEn !== "string")
    return { ok: false, error: 'Projeto precisa de "bodyPt" e "bodyEn" como texto (markdown).' };

  const normalized = {
    name: o.name,
    order: typeof o.order === "number" ? o.order : 5,
    year: typeof o.year === "string" ? o.year : "",
    featured: o.featured === true,
    gradient:
      typeof o.gradient === "string" && o.gradient.startsWith("linear-gradient")
        ? o.gradient
        : "linear-gradient(135deg,#6366f1,#8b5cf6 45%,#d946ef)",
    image: typeof o.image === "string" ? o.image : null,
    tagline: o.tagline,
    description: o.description,
    role: isLocalized(o.role) ? o.role : { pt: "", en: "" },
    tags: Array.isArray(o.tags) ? o.tags.filter((t) => typeof t === "string") : [],
    metrics: Array.isArray(o.metrics) ? o.metrics : [],
    link: typeof o.link === "string" ? o.link : null,
    bodyPt: o.bodyPt,
    bodyEn: o.bodyEn,
  };
  const slug = slugify(String(o.slug || o.name));
  return { ok: true, kind, slug, path: `src/content/projects/${slug}.json`, data: normalized };
}
