#!/bin/bash

# Script to create .gitkeep files for empty directories
# This ensures the folder structure is preserved in Git

echo "📁 Creating .gitkeep files for image directories..."

# Create directories if they don't exist
mkdir -p public/images/services
mkdir -p public/images/testimonials
mkdir -p public/images/pricing
mkdir -p public/images/themes
mkdir -p prisma/migrations

# Create .gitkeep files
touch public/images/services/.gitkeep
touch public/images/testimonials/.gitkeep
touch public/images/pricing/.gitkeep
touch public/images/themes/.gitkeep
touch prisma/migrations/.gitkeep

echo "✅ .gitkeep files created successfully!"
echo ""
echo "These folders will now be tracked by Git even when empty:"
echo "  - public/images/services/"
echo "  - public/images/testimonials/"
echo "  - public/images/pricing/"
echo "  - public/images/themes/"
echo "  - prisma/migrations/"

# Make script executable: chmod +x create-gitkeep.sh
# Run with: ./create-gitkeep.sh