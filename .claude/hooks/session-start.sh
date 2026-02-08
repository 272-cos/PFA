#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote environment)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
# Using 'npm install' instead of 'npm ci' to take advantage of container caching
npm install --prefer-offline --no-audit
