#!/bin/bash

# =============================================================================
# git-push.sh - Version bump + commit + push
# Usage: bash scripts/git-push.sh [feat|fix] [description]
# =============================================================================

set -e

COMMIT_TYPE="${1:-feat}"
CUSTOM_DESC="$2"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME=$(basename "$(pwd)")

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Push: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}========================================${NC}"

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes in ${PROJECT_NAME}. Nothing to push.${NC}"
    exit 0
fi

# --- Step 1: Version bump ---
echo -e "\n${GREEN}[1/4] Bumping version...${NC}"

OLD_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0")

if grep -q '"version:patch"' package.json 2>/dev/null; then
    npm run version:patch --silent
else
    npm version patch --no-git-tag-version --silent
    if [ -f "scripts/update-version.js" ]; then
        node scripts/update-version.js
    fi
fi

NEW_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.0.1")
echo -e "  ${OLD_VERSION} -> ${GREEN}${NEW_VERSION}${NC}"

# --- Step 2: Auto-generate description ---
echo -e "\n${GREEN}[2/4] Analyzing changes...${NC}"

if [ -z "$CUSTOM_DESC" ]; then
    CHANGED_FILES=$(git diff --name-only 2>/dev/null; git diff --cached --name-only 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)
    CHANGED_FILES=$(echo "$CHANGED_FILES" | sort -u)

    AREAS=()
    HAS_MIGRATION=false; HAS_ROUTE=false; HAS_SERVICE=false
    HAS_CONTROLLER=false; HAS_COMPONENT=false; HAS_STYLE=false
    HAS_CONFIG=false; HAS_PAGE=false; HAS_TYPE=false
    HAS_MIDDLEWARE=false; HAS_HOOK=false; HAS_SCRIPT=false

    while IFS= read -r file; do
        [ -z "$file" ] && continue
        case "$file" in
            *migration*|*migrate*) HAS_MIGRATION=true ;;
            *route*) HAS_ROUTE=true ;;
            *service*) HAS_SERVICE=true ;;
            *controller*) HAS_CONTROLLER=true ;;
            *.tsx|*.jsx) HAS_COMPONENT=true ;;
            *.css|*style*|*tailwind*) HAS_STYLE=true ;;
            *config*|*.env*) HAS_CONFIG=true ;;
            *script*|*.sh) HAS_SCRIPT=true ;;
            *page*|*app/*) HAS_PAGE=true ;;
            *type*|*interface*|*dto*) HAS_TYPE=true ;;
            *middleware*) HAS_MIDDLEWARE=true ;;
            *hook*) HAS_HOOK=true ;;
        esac
    done <<< "$CHANGED_FILES"

    $HAS_MIGRATION && AREAS+=("migrations")
    $HAS_ROUTE && AREAS+=("routes")
    $HAS_SERVICE && AREAS+=("services")
    $HAS_CONTROLLER && AREAS+=("controllers")
    $HAS_COMPONENT && AREAS+=("components")
    $HAS_STYLE && AREAS+=("styles")
    $HAS_CONFIG && AREAS+=("config")
    $HAS_PAGE && AREAS+=("pages")
    $HAS_TYPE && AREAS+=("types")
    $HAS_MIDDLEWARE && AREAS+=("middleware")
    $HAS_HOOK && AREAS+=("hooks")
    $HAS_SCRIPT && AREAS+=("scripts")

    FILE_COUNT=$(echo "$CHANGED_FILES" | grep -c '.' || true)

    if [ ${#AREAS[@]} -eq 0 ]; then
        DESCRIPTION="update ${FILE_COUNT} files"
    elif [ ${#AREAS[@]} -le 3 ]; then
        DESCRIPTION=$(IFS=', '; echo "${AREAS[*]}")
    else
        DESCRIPTION="${AREAS[0]}, ${AREAS[1]} and ${#AREAS[@]} more areas"
    fi
else
    DESCRIPTION="$CUSTOM_DESC"
fi

COMMIT_MSG="${COMMIT_TYPE}: v${NEW_VERSION} - ${DESCRIPTION}"
echo -e "  Commit: ${YELLOW}${COMMIT_MSG}${NC}"

# --- Step 3: Git add + commit ---
echo -e "\n${GREEN}[3/4] Committing...${NC}"
git add .
git commit -m "$COMMIT_MSG"
echo -e "  Committed successfully"

# --- Step 4: Git push ---
echo -e "\n${GREEN}[4/4] Pushing...${NC}"
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
if git rev-parse --verify "origin/${BRANCH}" >/dev/null 2>&1; then
    git push
else
    git push -u origin "$BRANCH"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ${PROJECT_NAME} v${NEW_VERSION} pushed!${NC}"
echo -e "${GREEN}========================================${NC}"
