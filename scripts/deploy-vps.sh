#!/usr/bin/env bash
#
# Atualiza o site no VPS: puxa o código novo, reinstala, rebuilda e reinicia.
# Rode ISTO NO VPS, dentro de /var/www/rodrigokrug:
#
#   bash scripts/deploy-vps.sh
#
# Pré-requisitos (já configurados na primeira instalação):
#   - .env com as chaves do GitHub App (modo servidor/admin web)
#   - processo pm2 chamado "personal"
#
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Puxando código novo do GitHub…"
git pull --ff-only

echo "→ Instalando dependências…"
npm ci

echo "→ Build (modo servidor, com admin web)…"
SERVER=1 npm run build

echo "→ Reiniciando o processo Node…"
pm2 restart personal --update-env
pm2 save

echo "✓ Deploy concluído. Conferindo:"
sleep 2
curl -s -o /dev/null -w "  home=%{http_code}\n" http://127.0.0.1:4321/
curl -s -o /dev/null -w "  keystatic=%{http_code}\n" http://127.0.0.1:4321/keystatic
