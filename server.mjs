// Inicializador do servidor no VPS.
// Carrega o .env (segredos: IMPORT_PASSWORD, GITHUB_TOKEN, etc.) ANTES de
// subir o servidor Astro/Node — o adapter standalone não faz isso sozinho.
// Use no pm2:  pm2 start server.mjs --name personal
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = join(here, ".env");
if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envPath);
}

// Sobe o servidor gerado pelo build (modo servidor).
await import("./dist/server/entry.mjs");
