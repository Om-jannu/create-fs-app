#!/bin/bash

# Release script for create-fs-app
# Usage: ./scripts/release.sh [patch|minor|major]

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

echo -e "${BLUE}🚀 Starting release process...${NC}\n"

# Check if git is clean
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}Error: Git working directory is not clean${NC}"
  echo "Please commit or stash your changes first"
  exit 1
fi

# Check if on master/main branch
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "master" && "$BRANCH" != "main" ]]; then
  echo -e "${YELLOW}Warning: You're not on master/main branch (current: $BRANCH)${NC}"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Pull latest changes
echo -e "${BLUE}📥 Pulling latest changes...${NC}"
git pull origin $BRANCH

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm test || {
  echo -e "${RED}Tests failed! Fix them before releasing.${NC}"
  exit 1
}

# Build
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build || {
  echo -e "${RED}Build failed!${NC}"
  exit 1
}

# Check what will be published
echo -e "${BLUE}📦 Checking package contents...${NC}"
npm pack --dry-run

echo -e "\n${YELLOW}Package contents look good?${NC}"
read -p "Continue with $RELEASE_TYPE release? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Release cancelled${NC}"
  exit 0
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Bump version
echo -e "${BLUE}📝 Bumping version ($RELEASE_TYPE)...${NC}"
npm version $RELEASE_TYPE -m "Release v%s"

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"

# Publish to npm
echo -e "${BLUE}📤 Publishing to npm...${NC}"
npm publish || {
  echo -e "${RED}Publish failed! Rolling back...${NC}"
  git tag -d "v${NEW_VERSION}"
  git reset --hard HEAD~1
  exit 1
}

# Push to git with tags
echo -e "${BLUE}⬆️  Pushing to git...${NC}"
git push --follow-tags

echo -e "\n${GREEN}✅ Release v${NEW_VERSION} published successfully!${NC}"
echo -e "${GREEN}🎉 Check it out: https://www.npmjs.com/package/create-fs-app${NC}"
echo -e "${BLUE}📝 Don't forget to update CHANGELOG.md${NC}"
