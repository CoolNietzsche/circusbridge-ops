#!/usr/bin/env bash
# Usage: bash sales-kit/build.sh        -> rebuild all PDFs into sales-kit/out/
set -e; cd "$(dirname "$0")"
python3 build.py && node render_pdf.js "$@"
