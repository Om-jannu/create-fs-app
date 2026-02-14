#!/bin/bash

# Deployment script for create-fs-app website
# Usage: ./deploy.sh [platform]
# Platforms: vercel, netlify, docker

set -e

echo "🚀 create-fs-app Website Deployment"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if platform is provided
PLATFORM=${1:-vercel}

echo -e "${BLUE}Platform: ${PLATFORM}${NC}"
echo ""

# Pre-deployment checks
echo "📋 Running pre-deployment checks..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules not found. Running npm install...${NC}"
    npm install
fi

# Type check
echo "🔍 Type checking..."
npm run type-check || {
    echo -e "${RED}❌ Type check failed${NC}"
    exit 1
}

# Build
echo "🏗️  Building production bundle..."
npm run build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
echo ""

# Deploy based on platform
case $PLATFORM in
    vercel)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        ;;
    
    netlify)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    
    docker)
        echo "🐳 Building Docker image..."
        docker build -t create-fs-app-website:latest .
        echo -e "${GREEN}✅ Docker image built successfully${NC}"
        echo ""
        echo "To run locally:"
        echo "  docker run -p 3000:3000 create-fs-app-website:latest"
        echo ""
        echo "To push to registry:"
        echo "  docker tag create-fs-app-website:latest your-registry/create-fs-app-website:latest"
        echo "  docker push your-registry/create-fs-app-website:latest"
        ;;
    
    *)
        echo -e "${RED}❌ Unknown platform: ${PLATFORM}${NC}"
        echo "Supported platforms: vercel, netlify, docker"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
