#!/usr/bin/env bash
# Push UrbanFlow AI Frontend Feature Branch to GitHub
set -e
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

echo "============================================================"
echo "  Pushing UrbanFlow AI Frontend Dashboard to GitHub"
echo "  Repository: https://github.com/rahultech-dom/smart_city.git"
echo "  Branch: feature/frontend-dashboard"
echo "============================================================"

git push -u origin feature/frontend-dashboard
echo "Push completed successfully."
