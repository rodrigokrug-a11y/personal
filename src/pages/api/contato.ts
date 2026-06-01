import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Recebe o formulário de contato e ENVIA o e-mail automaticamente via Resend,
 * sem abrir o app de e-mail do visitante. A mensagem chega no e-mail do dono.
 *
 * Variáveis no .env do VPS:
 *   RESEND_API_KEY   — chave da API do Resend (re_...)
 *   CONTACT_TO       — para quem chega (ex.: rodrigokrug@gmail.com)
 *   CONTACT_FROM     — remetente verificado no Resend
 *                      (ex.: "Site <contato@rodrigokrug.com.br>"; enquanto o
 *                       domínio não estiver verificado, use onboarding@resend.dev)
 */
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const POST: APIRoute = async ({ request }) => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const KEY = env.RESEND_API_KEY;
  const TO = env.CONTACT_TO || "rodrigokrug@gmail.com";
  const FROM = env.CONTACT_FROM || "Site Rodrigo Krug <onboarding@resend.dev>";

  if (!KEY) {
    return json(503, { ok: false, error: "Envio de e-mail ainda não configurado no servidor." });
  }

  // Aceita JSON (fetch) ou form-urlencoded (fallback sem JS).
  let name = "", email = "", message = "", botField = "";
  const ctype = request.headers.get("content-type") || "";
  try {
    if (ctype.includes("application/json")) {
      const b = await request.json();
      name = (b.name || "").trim();
      email = (b.email || "").trim();
      message = (b.message || "").trim();
      botField = (b._gotcha || "").trim();
    } else {
      const f = await request.formData();
      name = String(f.get("name") || "").trim();
      email = String(f.get("email") || "").trim();
      message = String(f.get("message") || "").trim();
      botField = String(f.get("_gotcha") || "").trim();
    }
  } catch {
    return json(400, { ok: false, error: "Requisição inválida." });
  }

  // Honeypot anti-spam: bots preenchem o campo escondido.
  if (botField) return json(200, { ok: true });

  if (!name || !email || !message) {
    return json(422, { ok: false, error: "Preencha nome, e-mail e mensagem." });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(422, { ok: false, error: "E-mail inválido." });
  }
  if (message.length > 5000) {
    return json(422, { ok: false, error: "Mensagem muito longa." });
  }

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1e293b">
      <h2 style="margin:0 0 12px">Nova mensagem pelo site</h2>
      <p style="margin:0"><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0"><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:14px 0" />
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email, // responder vai direto para o visitante
        subject: `Contato do site — ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return json(502, { ok: false, error: `Não consegui enviar agora. (${res.status})`, detail: txt.slice(0, 200) });
    }
    return json(200, { ok: true });
  } catch (e) {
    return json(502, { ok: false, error: "Falha de conexão ao enviar. Tente novamente." });
  }
};
