// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import node from "@astrojs/node";

/**
 * ============================================================================
 *  MODOS DE EXECUÇÃO
 *  --------------------------------------------------------------------------
 *  • dev (npm run dev):
 *      Site + editor /keystatic local (storage local, sem login).
 *  • estático (npm run build):
 *      Site 100% estático em dist/ — publicável em qualquer host.
 *      Use quando NÃO quiser o admin pela web.
 *  • servidor (SERVER=1 npm run build):
 *      Site + editor /keystatic pela WEB (storage GitHub + login).
 *      Gera um servidor Node (dist/server) para rodar no VPS.
 * ============================================================================
 */
const isDev = process.argv.includes("dev");
const isServer = process.env.SERVER === "1";

// O Keystatic roda em desenvolvimento (local) e no modo servidor (web).
const enableKeystatic = isDev || isServer;

// https://astro.build/config
export default defineConfig({
  // Domínio final do site (usado em URLs absolutas, sitemap, Open Graph).
  site: "https://rodrigokrug.com.br",

  // No modo servidor, renderiza sob demanda (necessário para o admin web).
  // Nos demais, continua estático.
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

  integrations: [react(), ...(enableKeystatic ? [keystatic()] : [])],

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
