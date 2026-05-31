export type Lang = "pt" | "en";

export const languages: Record<Lang, string> = {
  pt: "Português",
  en: "English",
};

export const defaultLang: Lang = "pt";

/**
 * Textos de interface (rótulos, botões, títulos de seção).
 * O conteúdo "de verdade" (projetos, experiência, etc.) fica em src/data/site.ts.
 */
export const ui = {
  pt: {
    "nav.about": "Sobre",
    "nav.projects": "Projetos",
    "nav.experience": "Experiência",
    "nav.consulting": "Consultoria",
    "nav.awards": "Prêmios",
    "nav.blog": "Blog",
    "nav.contact": "Contato",
    "nav.cta": "Vamos conversar",

    "hero.eyebrow": "Disponível para projetos e consultoria",
    "hero.cta.primary": "Ver projetos",
    "hero.cta.secondary": "Fale comigo",
    "hero.scroll": "Role para explorar",

    "about.eyebrow": "Sobre mim",
    "about.title": "Engenharia, operação e estratégia em um só lugar",

    "projects.eyebrow": "Portfólio",
    "projects.title": "Projetos que construí",
    "projects.subtitle":
      "Iniciativas que liderei e ajudei a construir — do conceito à operação.",
    "projects.role": "Meu papel",
    "projects.visit": "Visitar site",
    "projects.details": "Ver detalhes",
    "projects.back": "Voltar aos projetos",
    "projects.featured": "Destaque",

    "experience.eyebrow": "Trajetória",
    "experience.title": "Experiência & competências",
    "experience.subtitle":
      "Mais de uma década transformando engenharia em resultado de negócio.",
    "experience.skills": "Competências",
    "experience.education": "Formação",
    "experience.download": "Baixar currículo (PDF)",
    "experience.present": "Atual",

    "awards.eyebrow": "Reconhecimento",
    "awards.title": "Prêmios & reconhecimentos",
    "awards.subtitle":
      "Conquistas que marcam uma trajetória de inovação e resultado.",

    "clients.title": "Empresas para quem entreguei projetos",

    "blog.eyebrow": "Insights",
    "blog.title": "Artigos & ideias",
    "blog.subtitle":
      "Reflexões sobre operações, supply chain, produto e tecnologia.",
    "blog.readmore": "Ler artigo",
    "blog.back": "Voltar aos artigos",
    "blog.all": "Ver todos os artigos",

    "consulting.eyebrow": "Consultoria",
    "consulting.title": "Como posso ajudar sua empresa",
    "consulting.subtitle":
      "Apoio empresas a estruturar operações, escalar produtos e tomar decisões melhores.",
    "consulting.cta.title": "Vamos construir algo juntos?",
    "consulting.cta.text":
      "Seja para um projeto, uma vaga de liderança ou consultoria pontual — quero ouvir o seu desafio.",
    "consulting.cta.button": "Agendar uma conversa",

    "contact.eyebrow": "Contato",
    "contact.title": "Vamos conversar",
    "contact.subtitle":
      "Conte sobre o seu desafio. Respondo pessoalmente, em geral em até 1 dia útil.",
    "contact.email": "Enviar e-mail",
    "contact.or": "ou me encontre em",
    "form.name": "Nome",
    "form.email": "E-mail",
    "form.message": "Mensagem",
    "form.send": "Enviar mensagem",
    "form.placeholder.name": "Seu nome",
    "form.placeholder.email": "voce@empresa.com",
    "form.placeholder.message": "Como posso ajudar?",

    "footer.rights": "Todos os direitos reservados.",
    "footer.built": "Feito com Astro.",
    "lang.switch": "EN",
  },
  en: {
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.consulting": "Consulting",
    "nav.awards": "Awards",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.cta": "Let's talk",

    "hero.eyebrow": "Available for projects & consulting",
    "hero.cta.primary": "View projects",
    "hero.cta.secondary": "Get in touch",
    "hero.scroll": "Scroll to explore",

    "about.eyebrow": "About me",
    "about.title": "Engineering, operations and strategy in one place",

    "projects.eyebrow": "Portfolio",
    "projects.title": "Things I've built",
    "projects.subtitle":
      "Ventures I led and helped build — from concept to operation.",
    "projects.role": "My role",
    "projects.visit": "Visit site",
    "projects.details": "View details",
    "projects.back": "Back to projects",
    "projects.featured": "Featured",

    "experience.eyebrow": "Track record",
    "experience.title": "Experience & skills",
    "experience.subtitle":
      "Over a decade turning engineering into business results.",
    "experience.skills": "Skills",
    "experience.education": "Education",
    "experience.download": "Download résumé (PDF)",
    "experience.present": "Present",

    "awards.eyebrow": "Recognition",
    "awards.title": "Awards & recognition",
    "awards.subtitle":
      "Milestones that mark a track record of innovation and results.",

    "clients.title": "Companies I've delivered projects for",

    "blog.eyebrow": "Insights",
    "blog.title": "Articles & ideas",
    "blog.subtitle":
      "Thoughts on operations, supply chain, product and technology.",
    "blog.readmore": "Read article",
    "blog.back": "Back to articles",
    "blog.all": "See all articles",

    "consulting.eyebrow": "Consulting",
    "consulting.title": "How I can help your company",
    "consulting.subtitle":
      "I help companies structure operations, scale products and make better decisions.",
    "consulting.cta.title": "Let's build something together?",
    "consulting.cta.text":
      "Whether it's a project, a leadership role or focused consulting — I'd love to hear your challenge.",
    "consulting.cta.button": "Book a conversation",

    "contact.eyebrow": "Contact",
    "contact.title": "Let's talk",
    "contact.subtitle":
      "Tell me about your challenge. I reply personally, usually within one business day.",
    "contact.email": "Send an email",
    "contact.or": "or find me on",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Send message",
    "form.placeholder.name": "Your name",
    "form.placeholder.email": "you@company.com",
    "form.placeholder.message": "How can I help?",

    "footer.rights": "All rights reserved.",
    "footer.built": "Built with Astro.",
    "lang.switch": "PT",
  },
} as const;

export type UIKey = keyof (typeof ui)["pt"];

/** Retorna uma função t() para o idioma escolhido. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Caminho da home no idioma desejado (pt na raiz, en em /en). */
export function localizedHome(lang: Lang): string {
  return lang === "pt" ? "/" : "/en/";
}
