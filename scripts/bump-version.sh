#!/bin/bash

# Bump version script
# Usage: ./scripts/bump-version.sh [patch|minor|major]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get release type
RELEASE_TYPE=${1:-patch}

if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: Invalid release type. Use: patch, minor, or major${NC}"
  exit 1
fi

echo -e "${BLUE}📝 Bumping version ($RELEASE_TYPE)...${NC}\n"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Bump version in package.json
npm version $RELEASE_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"

# Update version in src/index.ts
sed -i.bak "s/.version('.*')/.version('${NEW_VERSION}')/" src/index.ts
rm -f src/index.ts.bak

echo -e "${GREEN}✅ Version updated in:${NC}"
echo -e "  - package.json"
echo -e "  - src/index.ts"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Update CHANGELOG.md with changes"
echo -e "2. Commit: ${BLUE}git add . && git commit -m 'Bump version to ${NEW_VERSION}'${NC}"
echo -e "3. Push: ${BLUE}git push${NC}"
echo -e "4. Merge PR to master/main"
echo -e "5. GitHub Actions will automatically publish to npm"
