#!/bin/bash
set -euo pipefail

export RESULT_VERSION=$(sqlite3 :memory: '.mode quote' '.load ./dist/debug/jsonschema0' 'select jsonschema_version()')
export RESULT_DEBUG=$(  sqlite3 :memory: '.mode quote' '.load ./dist/debug/jsonschema0' 'select jsonschema_debug()')

envsubst < site/reference.md.tmpl > site/reference.md
