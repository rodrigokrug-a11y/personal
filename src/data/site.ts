import type { Lang } from "../i18n/ui";

// Conteúdo editável pelo painel /keystatic (salvo em src/content/*.json).
import profileData from "../content/profile.json";
import experienceData from "../content/experience.json";
import consultingData from "../content/consulting.json";
import awardsData from "../content/awards.json";
import clientsData from "../content/clients.json";

/**
 * ============================================================================
 *  Este arquivo NÃO precisa mais ser editado à mão.
 *  Edite o conteúdo no painel visual:  npm run dev  →  /keystatic
 *  Aqui apenas carregamos os JSONs e os entregamos aos componentes.
 * ============================================================================
 */

export type Localized = Record<Lang, string>;

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "github" | "instagram" | "email" | "whatsapp";
}

export interface Metric {
  value: string;
  label: Localized;
}

export interface Project {
  slug: string;
  name: string;
  order: number;
  year: string;
  tagline: Localized;
  description: Localized;
  role: Localized;
  tags: string[];
  metrics: Metric[];
  link?: string;
  image?: string;
  gradient: string;
  featured?: boolean;
  /** Corpo em Markdown, por idioma. */
  body: Record<Lang, string>;
}

export interface Experience {
  role: Localized;
  company: string;
  period: Localized;
  location: Localized;
  description: Localized;
  achievements: Localized[];
}

export interface Education {
  degree: Localized;
  institution: string;
  period: string;
}

export interface SkillGroup {
  title: Localized;
  items: Localized[];
}

export interface Service {
  icon: "ops" | "growth" | "product" | "leadership";
  title: Localized;
  description: Localized;
}

export interface Award {
  title: Localized;
  issuer?: string;
  year: string;
}

export interface Client {
  name: string;
  logo?: string;
}

/** Garante que o caminho da imagem aponte para /images/… (resiliente ao
 *  formato salvo pelo Keystatic). Retorna undefined quando não há imagem. */
function img(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return "/images/" + value;
}

/* ---------------------------------------------------------------- PERFIL --- */
export const personal = {
  name: profileData.name,
  initials: profileData.initials,
  email: profileData.email,
  resumeUrl: profileData.resumeUrl,
  resumeUrlEn: (profileData as { resumeUrlEn?: string }).resumeUrlEn ?? profileData.resumeUrl,
  portrait: img(profileData.portrait) ?? "/images/portrait.svg",
  portraitAlt: img(profileData.portraitAlt) ?? "/images/portrait.svg",
  role: profileData.role as Localized,
  location: profileData.location as Localized,
  headline: profileData.headline as Localized,
  intro: profileData.intro as Localized,
  metaDescription: ((profileData as { metaDescription?: Localized }).metaDescription ??
    profileData.intro) as Localized,
  aboutTitle: profileData.aboutTitle as Localized,
  about: {
    pt: profileData.about.map((p) => p.pt),
    en: profileData.about.map((p) => p.en),
  } as { pt: string[]; en: string[] },
  stats: profileData.stats as Metric[],
};

/* ----------------------------------------------------------- REDES SOCIAIS - */
export const socials: SocialLink[] = profileData.socials as SocialLink[];

/* -------------------------------------------------------------- PROJETOS ---
   Cada projeto é um arquivo em src/content/projects/<slug>.json, criado e
   editado pelo painel /keystatic (coleção "Projetos"). Carregamos todos de
   uma vez e ordenamos pelo campo "order". */
const projectModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "../content/projects/*.json",
  { eager: true },
);

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, mod]) => {
    const p = mod.default as Record<string, any>;
    const slug = path.split("/").pop()!.replace(/\.json$/, "");
    return {
      slug,
      name: p.name,
      order: typeof p.order === "number" ? p.order : 999,
      year: p.year,
      tagline: p.tagline,
      description: p.description,
      role: p.role,
      tags: p.tags ?? [],
      metrics: p.metrics ?? [],
      link: p.link ?? undefined,
      image: img(p.image),
      gradient: p.gradient,
      featured: p.featured ?? false,
      body: { pt: p.bodyPt ?? "", en: p.bodyEn ?? "" },
    } as Project;
  })
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

/** Busca um projeto pelo slug (usado nas páginas de detalhe). */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ----------------------------------------------------------------- BLOG ---
   Cada artigo é um arquivo em src/content/blog/<slug>.json, criado e editado
   pelo painel /keystatic (coleção "Blog / Artigos"). Rascunhos (draft) são
   ocultados, e os mais recentes aparecem primeiro. */
export interface Article {
  slug: string;
  title: Localized;
  date: string;
  draft: boolean;
  featured: boolean;
  gradient: string;
  cover?: string;
  excerpt: Localized;
  tags: string[];
  /** Corpo em Markdown, por idioma. */
  body: Record<Lang, string>;
}

const blogModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "../content/blog/*.json",
  { eager: true },
);

/** Formata "2026-05-20" como data legível no idioma. */
export function formatDate(iso: string, lang: Lang): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const articles: Article[] = Object.entries(blogModules)
  .map(([path, mod]) => {
    const a = mod.default as Record<string, any>;
    const slug = path.split("/").pop()!.replace(/\.json$/, "");
    return {
      slug,
      title: { pt: a.title, en: a.titleEn || a.title },
      date: a.date ?? "",
      draft: a.draft ?? false,
      featured: a.featured ?? false,
      gradient: a.gradient,
      cover: img(a.cover),
      excerpt: a.excerpt,
      tags: a.tags ?? [],
      body: { pt: a.bodyPt ?? "", en: a.bodyEn ?? "" },
    } as Article;
  })
  .filter((a) => !a.draft)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

/** Busca um artigo pelo slug (usado nas páginas de detalhe). */
export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/* ------------------------------------------------------------ EXPERIÊNCIA -- */
export const experiences: Experience[] = experienceData.jobs as Experience[];
export const education: Education[] = experienceData.education as Education[];
export const skillGroups: SkillGroup[] = experienceData.skillGroups as SkillGroup[];

/* ------------------------------------------------------------ CONSULTORIA -- */
export const services: Service[] = consultingData.services as Service[];

/* --------------------------------------------------------------- PRÊMIOS --- */
export const awards: Award[] = awardsData.items as Award[];

/* -------------------------------------------------------------- EMPRESAS --- */
export const clients: Client[] = clientsData.items.map((c) => ({
  name: c.name,
  logo: img(c.logo),
})) as Client[];
