// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

/**
 * ============================================================================
 *  MODOS DE EXECUÇÃO
 *  --------------------------------------------------------------------------
 *  • dev (npm run dev):
 *      Site + editor /keystatic local + página /importar.
 *  • servidor (npm run build) — PADRÃO:
 *      Gera um servidor Node (dist/server) para o VPS. Habilita o editor
 *      /keystatic pela web E a página /importar. As páginas de conteúdo
 *      continuam pré-renderizadas (prerender), então o site segue rápido.
 *  (O site agora sempre roda como servidor Node no VPS — necessário para
 *   /importar e o editor. As páginas de conteúdo são pré-renderizadas, então
 *   continuam rápidas como estáticas.)
 * ============================================================================
 */
const isDev = process.argv.includes("dev");
const isStatic = process.env.STATIC === "1";
const isServer = !isStatic; // servidor é o padrão (build do VPS)

// O Keystatic roda em desenvolvimento e no modo servidor.
const enableKeystatic = isDev || isServer;

// https://astro.build/config
export default defineConfig({
  // Domínio final do site (usado em URLs absolutas, sitemap, Open Graph).
  site: "https://rodrigokrug.com.br",

  // Diretório de saída. Padrão "./dist". No VPS, o deploy builda para um
  // diretório de staging (OUT_DIR=dist-staging) e só troca pelo "dist" ao
  // final — deploy atômico, sem janela de site fora do ar durante o rebuild.
  outDir: process.env.OUT_DIR || "./dist",

  // Servidor por padrão (permite /importar e admin web). STATIC=1 → estático.
  output: isServer ? "server" : "static",
  ...(isServer ? { adapter: node({ mode: "standalone" }) } : {}),

  // Site bilíngue: Português é o padrão (na raiz "/"), Inglês fica em "/en".
  i18n: {
    locales: ["pt", "en"],
    defaultLocale: "pt",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    // Gera /sitemap-index.xml automaticamente. Exclui páginas privadas
    // (admin, importar) e a API — não devem aparecer no Google.
    sitemap({
      filter: (page) =>
        !/\/(admin|importar|keystatic|api)(\/|$)/.test(page),
      i18n: {
        defaultLocale: "pt",
        locales: { pt: "pt-BR", en: "en" },
      },
    }),
    ...(enableKeystatic ? [keystatic()] : []),
  ],

  vite: {
    plugins: [tailwindcss()],

    // Pré-empacota as dependências pesadas do editor para evitar o
    // "504 Outdated Optimize Dep" que deixava o /keystatic em branco.
    optimizeDeps: {
      include: [
        "@keystatic/core",
        "@keystatic/core/ui",
        "@keystatic/core/component-blocks",
        "react",
        "react-dom",
        "react-dom/client",
      ],
    },
  },
});
