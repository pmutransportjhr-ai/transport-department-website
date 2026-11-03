#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT="${1:-$ROOT/dist/transport-portal-webroot.tar.gz}"
mkdir -p "$(dirname "$OUTPUT")"

# Only take top-level website payload entries. Server configs, repository metadata,
# tests, CI files, scripts, historical backup content, and Apache .htaccess are omitted.
mapfile -t ITEMS < <(
  find "$ROOT" -mindepth 1 -maxdepth 1 \
    ! -name '.git' \
    ! -name '.github' \
    ! -name 'security' \
    ! -name 'scripts' \
    ! -name 'tests' \
    ! -name 'dist' \
    ! -name 'backup' \
    ! -name 'node_modules' \
    ! -name '.htaccess' \
    -printf '%f\n' | sort
)

if [ "${#ITEMS[@]}" -eq 0 ]; then
  echo "No website files found to package." >&2
  exit 1
fi

tar -czf "$OUTPUT" -C "$ROOT" "${ITEMS[@]}"

if tar -tzf "$OUTPUT" | grep -E '(^|/)(\.git|\.github|security|scripts|tests|backup|node_modules)(/|$)|(^|/)\.htaccess$'; then
  echo "Unsafe content found in deployment package; refusing to publish it." >&2
  rm -f "$OUTPUT"
  exit 1
fi

chmod 600 "$OUTPUT"
echo "Created safe static-site archive: $OUTPUT"
