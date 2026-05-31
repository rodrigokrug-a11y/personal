// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// O editor de conteúdo (Keystatic) é carregado APENAS em desenvolvimento.
// Assim o `npm run build` continua 100% estático e publicável em qualquer host.
// Quando quiser editar pela web, veja as instruções no README.
const enableKeystatic = process.argv.includes("dev");

// https://astro.build/config
export default defineConfig({
  // 🔧 Troque para o domínio final quando publicar (ex.: "https://rodrigokrug.com")
  site: "https://exemplo.com",

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

    // O painel /keystatic (especialmente o editor de texto rico) puxa muitas
    // dependências pesadas. Sem isso, o Vite as descobre sob demanda e
    // re-otimiza no meio do carregamento, causando "504 Outdated Optimize Dep"
    // e deixando o admin em branco. Pré-empacotar resolve de forma estável.
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
