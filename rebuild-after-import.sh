#!/usr/bin/env bash
# Reconstrói o site após uma importação (chamado pelo endpoint /api/importar).
# Faz build em modo servidor e reinicia o processo pm2. Trava simples para
# não rodar dois rebuilds ao mesmo tempo. Log em rebuild.log.
set -uo pipefail
cd "$(dirname "$0")"

LOCK=/tmp/rodrigokrug-rebuild.lock
if [ -f "$LOCK" ] && kill -0 "$(cat "$LOCK" 2>/dev/null)" 2>/dev/null; then
  echo "[$(date -u +%FT%TZ)] rebuild já em andamento, ignorando." >> rebuild.log
  exit 0
fi
echo $$ > "$LOCK"

{
  echo "[$(date -u +%FT%TZ)] rebuild iniciado…"
  SERVER=1 npm run build
  pm2 restart personal --update-env
  echo "[$(date -u +%FT%TZ)] rebuild concluído."
} >> rebuild.log 2>&1

rm -f "$LOCK"
