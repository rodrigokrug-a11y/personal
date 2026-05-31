import { marked } from "marked";

/**
 * Converte Markdown em HTML (no build — não envia JavaScript ao navegador).
 * Usado nas páginas de projeto e de artigo. Suporta GitHub-Flavored Markdown:
 * títulos, listas, **negrito**, links, imagens, `código`, citações e tabelas.
 *
 * O conteúdo é escrito pelo próprio Rodrigo (fonte confiável), então o HTML
 * gerado é renderizado direto. O resultado é estilizado pela classe .richtext
 * em src/styles/global.css.
 */
marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(md: unknown): string {
  if (typeof md !== "string" || md.trim() === "") return "";
  return marked.parse(md) as string;
}
