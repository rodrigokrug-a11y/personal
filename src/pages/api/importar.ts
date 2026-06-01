import type { APIRoute } from "astro";
import { validateImport, type ContentKind } from "../../lib/import-content";

export const prerender = false;

/**
 * Recebe o JSON colado na página /importar, valida, e grava o arquivo no
 * repositório do GitHub (via API). O GitHub dispara o webhook que reconstrói
 * o site no VPS — então o conteúdo aparece sozinho em ~1-2 min.
 *
 * Protegido por senha (IMPORT_PASSWORD) — definida só no .env do VPS.
 * Requer: GITHUB_TOKEN, GITHUB_REPO ("owner/name"), IMPORT_PASSWORD.
 */
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  // No servidor Node (runtime), os segredos vêm de process.env — não de
  // import.meta.env (que só conhece variáveis em build-time).
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const PASSWORD = env.IMPORT_PASSWORD;
  const TOKEN = env.GITHUB_TOKEN;
  const REPO = env.GITHUB_REPO || "rodrigokrug-a11y/personal";

  if (!PASSWORD || !TOKEN) {
    return json(503, { ok: false, error: "Importação ainda não configurada no servidor (faltam IMPORT_PASSWORD / GITHUB_TOKEN no .env)." });
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
  if (!result.ok) {
    return json(422, result);
  }

  const fileContent = JSON.stringify(result.data, null, 2) + "\n";
  const apiBase = `https://api.github.com/repos/${REPO}/contents/${result.path}`;
  const ghHeaders = {
    authorization: `Bearer ${TOKEN}`,
    accept: "application/vnd.github+json",
    "user-agent": "rodrigokrug-importer",
    "x-github-api-version": "2022-11-28",
  };

  // Existe? (precisamos do sha para sobrescrever)
  let existingSha: string | undefined;
  try {
    const head = await fetch(apiBase, { headers: ghHeaders });
    if (head.ok) {
      const j = await head.json();
      existingSha = j.sha;
    }
  } catch {
    /* segue como criação */
  }

  if (existingSha && !payload.overwrite) {
    return json(409, {
      ok: false,
      conflict: true,
      slug: result.slug,
      kind: result.kind,
      error: `Já existe um ${result.kind} com o endereço "${result.slug}". Marque "substituir" para sobrescrever.`,
    });
  }

  // Encode UTF-8 → base64 (conteúdo tem acentos/emoji)
  const b64 = btoa(unescape(encodeURIComponent(fileContent)));
  const commitMsg = `${existingSha ? "Update" : "Add"} ${result.kind} via importer: ${result.slug}`;

  const put = await fetch(apiBase, {
    method: "PUT",
    headers: { ...ghHeaders, "content-type": "application/json" },
    body: JSON.stringify({
      message: commitMsg,
      content: b64,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!put.ok) {
    const txt = await put.text();
    return json(502, { ok: false, error: `Falha ao salvar no GitHub (${put.status}). ${txt.slice(0, 200)}` });
  }

  return json(200, {
    ok: true,
    kind: result.kind,
    slug: result.slug,
    path: result.path,
    updated: !!existingSha,
    url: result.kind === "blog" ? `/blog/${result.slug}` : `/projetos/${result.slug}`,
  });
};
