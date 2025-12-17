#!/bin/bash

# ====================================
# Quick Deploy Script for Marketing Kit
# ====================================

set -e  # Exit on error

echo "🚀 Marketing Kit - Quick Deploy Script"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ====================================
# STEP 1: Verify Prerequisites
# ====================================

echo "📋 Step 1: Checking prerequisites..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# ====================================
# STEP 2: Setup Project Files
# ====================================

echo "📦 Step 2: Setting up project files..."

# Create .gitkeep files
echo "Creating .gitkeep files..."
mkdir -p public/images/services
mkdir -p public/images/testimonials
mkdir -p public/images/pricing
mkdir -p prisma/migrations

touch public/images/services/.gitkeep
touch public/images/testimonials/.gitkeep
touch public/images/pricing/.gitkeep
touch prisma/migrations/.gitkeep

echo -e "${GREEN}✅ Project files setup complete${NC}"
echo ""

# ====================================
# STEP 3: Git Setup
# ====================================

echo "🔧 Step 3: Setting up Git..."

# Check git status
if [ -d .git ]; then
    echo -e "${YELLOW}⚠️  Git already initialized${NC}"
else
    echo "Initializing git..."
    git init
fi

# Show git status
echo ""
echo "Current git status:"
git status --short

echo ""
echo -e "${GREEN}✅ Git setup complete${NC}"
echo ""

# ====================================
# STEP 4: Commit Changes
# ====================================

echo "💾 Step 4: Creating initial commit..."

# Stage all files
git add .

# Create commit
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    git commit -m "Initial commit: Marketing Kit - Next.js, Prisma, PostgreSQL

Features:
- Services CRUD with admin panel
- Pricing plans management
- Testimonials system
- Dynamic content sections
- Image upload support
- PostgreSQL with Prisma ORM
- Authentication ready
- Responsive design
"
    echo -e "${GREEN}✅ Commit created${NC}"
fi

echo ""

# ====================================
# STEP 5: GitHub Remote Setup
# ====================================

echo "🌐 Step 5: GitHub remote setup"
echo ""
echo -e "${YELLOW}⚠️  Manual step required!${NC}"
echo ""
echo "Please:"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: marketing-kit"
echo "3. Visibility: Private (recommended)"
echo "4. DON'T add README, .gitignore, or license"
echo "5. Click 'Create repository'"
echo ""
read -p "Press Enter when repository is created..."
echo ""

# Ask for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username cannot be empty${NC}"
    exit 1
fi

# Remove existing remote if any
git remote remove origin 2>/dev/null || true

# Add remote
REPO_URL="https://github.com/$GITHUB_USERNAME/marketing-kit.git"
echo "Adding remote: $REPO_URL"
git remote add origin "$REPO_URL"

# Verify remote
echo ""
echo "Remote repository:"
git remote -v

echo ""
echo -e "${GREEN}✅ GitHub remote configured${NC}"
echo ""

# ====================================
# STEP 6: Push to GitHub
# ====================================

echo "📤 Step 6: Pushing to GitHub..."
echo ""

# Rename branch to main if needed
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo ""
    echo "View your repository at:"
    echo "https://github.com/$GITHUB_USERNAME/marketing-kit"
else
    echo ""
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    echo ""
    echo "Common issues:"
    echo "1. Wrong repository URL"
    echo "2. Not authenticated - run: git config --global credential.helper osxkeychain"
    echo "3. Repository doesn't exist"
    echo ""
    exit 1
fi

echo ""

# ====================================
# STEP 7: Build Test
# ====================================

echo "🔨 Step 7: Testing build..."
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo ""
    echo "Fix the errors above before deploying"
    exit 1
fi

echo ""

# ====================================
# FINAL SUMMARY
# ====================================

echo "======================================"
echo -e "${GREEN}🎉 Pre-deployment Complete!${NC}"
echo "======================================"
echo ""
echo "✅ What's done:"
echo "  - Project files configured"
echo "  - Git repository initialized"
echo "  - Code committed to Git"
echo "  - Pushed to GitHub"
echo "  - Build tested successfully"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Setup Production Database:"
echo "   - Option A: Vercel Postgres (https://vercel.com/dashboard/stores)"
echo "   - Option B: Neon (https://neon.tech)"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to: https://vercel.com/new"
echo "   - Import from GitHub: $GITHUB_USERNAME/marketing-kit"
echo "   - Add environment variables:"
echo "     DATABASE_URL = <your-production-db-url>"
echo "     JWT_SECRET = qwertyuiopasdfghjklzxcvbnm123456"
echo "   - Click Deploy"
echo ""
echo "3. After deployment:"
echo "   - Migrate database: npx prisma db push"
echo "   - Run seed: npm run seed"
echo "   - Test at: https://your-app.vercel.app"
echo ""
echo "📖 For detailed guide, see: DEPLOYMENT.md"
echo ""
echo -e "${GREEN}Good luck with your deployment! 🚀${NC}"
echo ""