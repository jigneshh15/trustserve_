#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if ! command -v java >/dev/null 2>&1; then
  echo 'Install Java 21 and make sure java is on your PATH.' >&2
  exit 1
fi
export DEMO_PASSWORD='TrustDemo123!'
echo 'Open http://localhost:8080 after TrustServe starts.'
exec java -jar TrustServe.jar --server.address=127.0.0.1
