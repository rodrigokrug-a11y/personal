import type { APIRoute } from "astro";
import { validateImport, type ContentKind } from "../../lib/import-content";
import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { exec } from "node:child_process";

export const prerender = false;

/**
 * Recebe o JSON colado em /importar, valida e GRAVA o arquivo direto no
 * servidor (src/content/...). Em seguida dispara um rebuild do site.
 * Simples: sem token do GitHub, sem API externa.
 *
 * Protegido por senha (IMPORT_PASSWORD no .env do VPS).
 */
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const PASSWORD = env.IMPORT_PASSWORD;

  if (!PASSWORD) {
    return json(503, { ok: false, error: "Importação ainda não configurada no servidor (falta IMPORT_PASSWORD no .env)." });
  }

  let payload: { password?: string; content?: string; kind?: ContentKind; overwrite?: boolean };
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: "Requisição inválida." });
  }

  if (payload.password !== PASSWORD) {
    return json(401, { ok: false, error: "Senha incorreta." });
  }

  const result = validateImport(payload.content || "", payload.kind);
  if (!result.ok || !result.path || !result.data) {
    return json(422, result);
  }

  // Raiz do projeto = cwd do processo (no VPS, /var/www/rodrigokrug).
  const root = env.CONTENT_ROOT || process.cwd();
  const filePath = resolve(root, result.path);

  // Segurança: garante que o caminho fica dentro de src/content (sem ../).
  const contentDir = resolve(root, "src/content");
  if (!filePath.startsWith(contentDir)) {
    return json(400, { ok: false, error: "Caminho inválido." });
  }

  const already = await exists(filePath);
  if (already && !payload.overwrite) {
    return json(409, {
      ok: false,
      conflict: true,
      slug: result.slug,
      kind: result.kind,
      error: `Já existe um ${result.kind} com o endereço "${result.slug}". Marque "substituir" para sobrescrever.`,
    });
  }

  // Grava o arquivo.
  try {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(result.data, null, 2) + "\n", "utf8");
  } catch (e) {
    return json(500, { ok: false, error: "Não consegui gravar o arquivo no servidor: " + (e as Error).message });
  }

  // Dispara o rebuild em background (não bloqueia a resposta).
  // O script faz: build + restart do pm2. Definido em REBUILD_CMD ou padrão.
  const rebuildCmd = env.REBUILD_CMD || `bash ${join(root, "rebuild-after-import.sh")}`;
  exec(rebuildCmd, { cwd: root }, () => {});

  return json(200, {
    ok: true,
    kind: result.kind,
    slug: result.slug,
    path: result.path,
    updated: already,
    url: result.kind === "blog" ? `/blog/${result.slug}` : `/projetos/${result.slug}`,
  });
};
