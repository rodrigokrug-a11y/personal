#!/usr/bin/env bash
# Reconstrói o site após uma importação (chamado pelo endpoint /api/importar).
# Build ATÔMICO: gera dist-staging e só troca pelo dist quando estiver 100%
# pronto; se o build falhar, o dist atual é mantido (site nunca cai por build
# quebrado). Lock compartilhado com auto-rebuild.sh evita builds concorrentes.
set -uo pipefail
cd "$(dirname "$0")"

LOCK=/tmp/rodrigokrug-rebuild.lock
if [ -f "$LOCK" ] && kill -0 "$(cat "$LOCK" 2>/dev/null)" 2>/dev/null; then
  echo "[$(date -u +%FT%TZ)] rebuild já em andamento, ignorando." >> rebuild.log
  exit 0
fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

{
  echo "[$(date -u +%FT%TZ)] rebuild iniciado…"
  rm -rf dist-staging
  if OUT_DIR=dist-staging SERVER=1 npm run build && [ -f dist-staging/server/entry.mjs ]; then
    rm -rf dist-prev
    mv dist dist-prev 2>/dev/null || true
    mv dist-staging dist
    pm2 restart personal --update-env
    rm -rf dist-prev
    echo "[$(date -u +%FT%TZ)] deploy atômico concluído."
  else
    echo "[$(date -u +%FT%TZ)] BUILD FALHOU — dist atual mantido."
    rm -rf dist-staging
  fi
} >> rebuild.log 2>&1
