# Deploy no VPS (rodrigokrug.com.br) com editor pela web

Servidor: Ubuntu 24.04, nginx, Node 20, pm2, certbot — já instalados.
O app roda como serviço Node (pm2) atrás do nginx. O site em si é estático
(rápido); só o editor `/keystatic` e suas APIs são dinâmicos (login + GitHub).

IPv4 do VPS: **2.24.208.73** · App local: **127.0.0.1:4321** (pm2: `personal`)

---

## Fase 1 — App no VPS ✅ (feito)

```bash
cd /var/www && git clone https://github.com/rodrigokrug-a11y/personal.git rodrigokrug
cd /var/www/rodrigokrug && npm ci && SERVER=1 npm run build
HOST=127.0.0.1 PORT=4321 pm2 start dist/server/entry.mjs --name personal && pm2 save
```

## Fase 2 — Login do editor (GitHub App)

1. Pelo navegador, abra o editor (enquanto o nginx não está pronto, use um túnel
   SSH a partir da sua máquina):

   ```bash
   ssh -L 4321:127.0.0.1:4321 root@2.24.208.73
   # depois abra http://localhost:4321/keystatic no navegador
   ```

2. Em `/keystatic`, clique **"Log in with GitHub" → "Create GitHub App"**.
   Dê um nome (ex.: `rodrigokrug-cms`) e autorize no repositório `personal`.
   No fim, o Keystatic mostra as variáveis. Crie o `.env` no VPS:

   ```bash
   cd /var/www/rodrigokrug
   cat > .env <<'EOF'
   KEYSTATIC_GITHUB_CLIENT_ID=...
   KEYSTATIC_GITHUB_CLIENT_SECRET=...
   KEYSTATIC_SECRET=...
   PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=rodrigokrug-cms
   EOF
   ```

3. Rebuild + restart para ativar o modo GitHub:

   ```bash
   SERVER=1 npm run build && pm2 restart personal --update-env && pm2 save
   ```

   A partir daqui, `/keystatic` exige login e só quem tem acesso ao repo edita.
   Cada edição vira um commit no GitHub.

## Fase 3 — nginx (HTTP)

Crie `/etc/nginx/sites-available/rodrigokrug.com.br` com o conteúdo de
`nginx/rodrigokrug.com.br.conf` (neste repo), ative e recarregue:

```bash
ln -s /etc/nginx/sites-available/rodrigokrug.com.br /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## Fase 4 — DNS na UOL (você faz)  ⚠️ aqui o WordPress sai do ar

No painel de DNS da UOL (ns*.dominios.uol.com.br), no domínio
`rodrigokrug.com.br`:

- Remova os registros **A** atuais (apontam para o WordPress.com).
- Crie um registro **A**:  `@`  →  `2.24.208.73`
- Crie um registro **A**:  `www` → `2.24.208.73`
- (Remova registros AAAA antigos do WordPress, se houver.)

A propagação leva de minutos a algumas horas. Confira com:
`dig +short rodrigokrug.com.br` (deve retornar 2.24.208.73).

## Fase 5 — HTTPS (após o DNS propagar)

```bash
certbot --nginx -d rodrigokrug.com.br -d www.rodrigokrug.com.br
```

O certbot configura o SSL e o redirecionamento HTTP→HTTPS automaticamente.

---

## Atualizar o site depois (rotina)

Qualquer mudança no código: faça commit/push na sua máquina e, no VPS:

```bash
cd /var/www/rodrigokrug && bash scripts/deploy-vps.sh
```

> Mudanças de **conteúdo** feitas pelo editor `/keystatic` já viram commit no
> GitHub sozinhas — mas para o site servido refletir, rode o deploy acima
> (ou configure o GitHub Actions da Fase 6, opcional).

## Observação de segurança

- O `.env` (chaves do GitHub App) fica **só no VPS**, nunca no Git.
- O `/keystatic` só permite editar quem tem acesso de escrita ao repo `personal`.
- O site público é estático; o servidor Node só processa o editor e suas APIs.
