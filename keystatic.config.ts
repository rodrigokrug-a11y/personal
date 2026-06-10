import { config, fields, singleton, collection } from "@keystatic/core";

/**
 * ============================================================================
 *  EDITOR DE CONTEÚDO (Keystatic)
 *  Acesse em http://localhost:4321/keystatic com o `npm run dev` rodando.
 *  Tudo que você editar aqui é salvo nos arquivos src/content/*.json e o site
 *  passa a refletir as mudanças. Campos PT e EN ficam lado a lado.
 * ============================================================================
 */

// Campo bilíngue (PT + EN) reaproveitável.
const loc = (label: string, multiline = false) =>
  fields.object(
    {
      pt: fields.text({ label: label + " (PT)", multiline }),
      en: fields.text({ label: label + " (EN)", multiline }),
    },
    { label },
  );

// Par de textos PT/EN simples (para itens de lista).
const ptEn = () =>
  fields.object({
    pt: fields.text({ label: "PT" }),
    en: fields.text({ label: "EN" }),
  });

// Métrica: número + legenda bilíngue.
const metric = () =>
  fields.object({
    value: fields.text({ label: "Número" }),
    label: loc("Legenda"),
  });

// Corpo de página em Markdown puro: títulos (##), listas, **negrito**,
// links, imagens, `código`, citações e tabelas. Markdown é fácil de escrever
// à mão, de colar do Claude e de versionar.
const richBody = (label: string) =>
  fields.text({
    label,
    multiline: true,
    description:
      "Escreva em Markdown: ## Título, - listas, **negrito**, [link](url), ![alt](/imagem.png), tabelas.",
  });

const GRADIENTS = [
  { label: "Turquesa → Profundo", value: "linear-gradient(135deg,#0abfae,#047c71 45%,#0c4f48)" },
  { label: "Turquesa → Grafite", value: "linear-gradient(135deg,#0abfae,#019b8d 45%,#1d2021)" },
  { label: "Grafite → Turquesa", value: "linear-gradient(135deg,#1d2021,#343a3c 50%,#0abfae)" },
  { label: "Turquesa claro → Turquesa", value: "linear-gradient(135deg,#5ce2d2,#0abfae 45%,#047c71)" },
  { label: "Profundo → Grafite", value: "linear-gradient(135deg,#047c71,#0c4f48 45%,#141617)" },
] as const;

// Em produção (VPS) usamos o GitHub como storage — é assim que o editor
// salva o conteúdo pela web e exige login. Localmente continua "local"
// (sem login, salvando direto nos arquivos).
const useGitHub = !!import.meta.env?.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;

export default config({
  storage: useGitHub
    ? { kind: "github", repo: { owner: "rodrigokrug-a11y", name: "personal" } }
    : { kind: "local" },
  ui: {
    brand: { name: "Rodrigo Krug" },
    navigation: {
      Conteúdo: ["profile", "projects", "blog", "experience", "awards", "clients", "consulting"],
    },
  },
  collections: {
    // -------------------------------------------------------------- PROJETOS
    projects: collection({
      label: "Projetos",
      path: "src/content/projects/*",
      slugField: "name",
      format: { data: "json" },
      columns: ["name", "year"],
      schema: {
        name: fields.slug({
          name: { label: "Nome" },
          slug: {
            label: "Endereço da página (slug)",
            description: "Aparece na URL, ex.: /projetos/cliever",
          },
        }),
        order: fields.integer({
          label: "Ordem de exibição",
          defaultValue: 1,
          description: "Menor número aparece primeiro.",
        }),
        year: fields.text({ label: "Ano / período", description: "Ex.: 2021 — presente" }),
        draft: fields.checkbox({
          label: "Rascunho (não publicar)",
          defaultValue: false,
          description: "Marque para esconder do site (home, página e Google) até estar pronto.",
        }),
        featured: fields.checkbox({ label: "Destaque (★)", defaultValue: false }),
        gradient: fields.select({
          label: "Cor do cartão",
          options: GRADIENTS as unknown as { label: string; value: string }[],
          defaultValue: GRADIENTS[0].value,
        }),
        image: fields.image({
          label: "Imagem de capa (opcional)",
          description: "Sem imagem, o cartão usa um gradiente com a inicial.",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
        tagline: loc("Subtítulo"),
        description: loc("Resumo (aparece no cartão)", true),
        role: loc("Seu papel"),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (p) => p.value || "Tag",
        }),
        metrics: fields.array(metric(), {
          label: "Métricas",
          itemLabel: (p) => p.fields.value.value || "Métrica",
        }),
        link: fields.url({ label: "Link externo (site do projeto, opcional)" }),
        bodyPt: richBody("Conteúdo da página — Português"),
        bodyEn: richBody("Conteúdo da página — English"),
      },
    }),

    // ----------------------------------------------------------------- BLOG
    blog: collection({
      label: "Blog / Artigos",
      path: "src/content/blog/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "date"],
      schema: {
        title: fields.slug({
          name: { label: "Título (Português)" },
          slug: {
            label: "Endereço (slug)",
            description: "Aparece na URL, ex.: /blog/escalando-operacoes",
          },
        }),
        titleEn: fields.text({ label: "Título (English)" }),
        date: fields.date({
          label: "Data de publicação",
          description: "Os artigos mais recentes aparecem primeiro.",
        }),
        draft: fields.checkbox({
          label: "Rascunho (não publicar)",
          defaultValue: false,
          description: "Marque para esconder do site até estar pronto.",
        }),
        featured: fields.checkbox({ label: "Destaque (★)", defaultValue: false }),
        gradient: fields.select({
          label: "Cor do cartão",
          options: GRADIENTS as unknown as { label: string; value: string }[],
          defaultValue: GRADIENTS[0].value,
        }),
        cover: fields.image({
          label: "Imagem de capa (opcional)",
          directory: "public/images/blog",
          publicPath: "/images/blog/",
        }),
        excerpt: loc("Resumo (aparece no cartão e no Google)", true),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (p) => p.value || "Tag",
        }),
        bodyPt: richBody("Conteúdo do artigo — Português"),
        bodyEn: richBody("Conteúdo do artigo — English"),
      },
    }),
  },
  singletons: {
    // ---------------------------------------------------------------- PERFIL
    profile: singleton({
      label: "Perfil & topo",
      path: "src/content/profile",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Nome" }),
        initials: fields.text({ label: "Iniciais (logo)", description: "Ex.: RK" }),
        email: fields.text({ label: "E-mail" }),
        resumeUrl: fields.text({
          label: "Currículo PDF (Português)",
          description: "Caminho do PDF em /public, ex.: /Rodrigo-Krug-CV.pdf",
        }),
        resumeUrlEn: fields.text({
          label: "Currículo PDF (English)",
          description: "Caminho do PDF em inglês, ex.: /Rodrigo-Krug-Resume-EN.pdf",
        }),
        portrait: fields.image({
          label: "Foto principal (Hero)",
          directory: "public/images",
          publicPath: "/images/",
        }),
        portraitAlt: fields.image({
          label: "Foto secundária (Sobre)",
          directory: "public/images",
          publicPath: "/images/",
        }),
        role: loc("Cargo / título"),
        location: loc("Localização"),
        headline: loc("Frase de destaque (Hero)", true),
        intro: loc("Introdução (Hero)", true),
        aboutTitle: loc("Título da seção Sobre"),
        about: fields.array(
          fields.object({
            pt: fields.text({ label: "PT", multiline: true }),
            en: fields.text({ label: "EN", multiline: true }),
          }),
          {
            label: "Sobre — parágrafos",
            itemLabel: (p) => (p.fields.pt.value || "Parágrafo").slice(0, 40),
          },
        ),
        stats: fields.array(metric(), {
          label: "Estatísticas (Sobre)",
          itemLabel: (p) => p.fields.value.value || "Estatística",
        }),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: "Nome" }),
            href: fields.url({ label: "Link" }),
            icon: fields.select({
              label: "Ícone",
              options: [
                { label: "LinkedIn", value: "linkedin" },
                { label: "GitHub", value: "github" },
                { label: "Instagram", value: "instagram" },
                { label: "E-mail", value: "email" },
              ],
              defaultValue: "linkedin",
            }),
          }),
          {
            label: "Redes sociais",
            itemLabel: (p) => p.fields.label.value || "Rede",
          },
        ),
      },
    }),

    // ------------------------------------------------------------ EXPERIÊNCIA
    experience: singleton({
      label: "Experiência & currículo",
      path: "src/content/experience",
      format: { data: "json" },
      schema: {
        jobs: fields.array(
          fields.object({
            role: loc("Cargo"),
            company: fields.text({ label: "Empresa" }),
            period: loc("Período"),
            location: loc("Local"),
            description: loc("Descrição", true),
            achievements: fields.array(ptEn(), {
              label: "Conquistas",
              itemLabel: (p) => (p.fields.pt.value || "Conquista").slice(0, 40),
            }),
          }),
          {
            label: "Experiências",
            itemLabel: (p) => p.fields.company.value || "Experiência",
          },
        ),
        education: fields.array(
          fields.object({
            degree: loc("Formação"),
            institution: fields.text({ label: "Instituição" }),
            period: fields.text({ label: "Período", description: "Ex.: 2010 — 2015" }),
          }),
          {
            label: "Formação",
            itemLabel: (p) => p.fields.institution.value || "Formação",
          },
        ),
        skillGroups: fields.array(
          fields.object({
            title: loc("Grupo"),
            items: fields.array(ptEn(), {
              label: "Competências",
              itemLabel: (p) => (p.fields.pt.value || "Competência").slice(0, 30),
            }),
          }),
          {
            label: "Grupos de competências",
            itemLabel: (p) => p.fields.title.fields.pt.value || "Grupo",
          },
        ),
      },
    }),

    // --------------------------------------------------------------- PRÊMIOS
    awards: singleton({
      label: "Prêmios & reconhecimentos",
      path: "src/content/awards",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            title: loc("Prêmio / reconhecimento"),
            issuer: fields.text({ label: "Concedido por (opcional)" }),
            year: fields.text({ label: "Ano" }),
          }),
          {
            label: "Prêmios",
            itemLabel: (p) => p.fields.title.fields.pt.value || "Prêmio",
          },
        ),
      },
    }),

    // -------------------------------------------------------------- EMPRESAS
    clients: singleton({
      label: "Empresas / clientes",
      path: "src/content/clients",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Nome da empresa" }),
            logo: fields.image({
              label: "Logo (opcional)",
              description: "Sem logo, mostramos o nome em texto. Você assume a responsabilidade pelo uso da marca.",
              directory: "public/images/clients",
              publicPath: "/images/clients/",
            }),
          }),
          {
            label: "Empresas",
            itemLabel: (p) => p.fields.name.value || "Empresa",
          },
        ),
      },
    }),

    // ------------------------------------------------------------ CONSULTORIA
    consulting: singleton({
      label: "Consultoria",
      path: "src/content/consulting",
      format: { data: "json" },
      schema: {
        services: fields.array(
          fields.object({
            icon: fields.select({
              label: "Ícone",
              options: [
                { label: "Operações", value: "ops" },
                { label: "Crescimento", value: "growth" },
                { label: "Produto", value: "product" },
                { label: "Liderança", value: "leadership" },
              ],
              defaultValue: "ops",
            }),
            title: loc("Título"),
            description: loc("Descrição", true),
          }),
          {
            label: "Serviços",
            itemLabel: (p) => p.fields.title.fields.pt.value || "Serviço",
          },
        ),
      },
    }),
  },
});
