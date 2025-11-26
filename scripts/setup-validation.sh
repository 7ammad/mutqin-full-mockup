#!/bin/bash

echo "dYs? Setting up TypeScript validation workflow..."
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "�s��,?  No package.json found. This doesn't appear to be a Node.js project."
  echo "   If this is a new project, run: npm init -y"
  exit 1
fi

echo "�o. Node.js project detected"
echo ""

# Backup package.json
echo "dY"� Backing up package.json..."
cp package.json package.json.backup

# Check if TypeScript is installed
if ! grep -q '"typescript"' package.json; then
  echo "�s��,?  TypeScript not found in dependencies."
  echo "   Install with: npm install --save-dev typescript"
  echo "   Continuing anyway..."
fi

# Add type-check scripts if they don't exist
echo "dY"? Checking for validation scripts..."

if ! grep -q '"type-check"' package.json; then
  echo "   Adding type-check script..."
  npm pkg set scripts.type-check="tsc --noEmit"
  npm pkg set scripts.type-check:watch="tsc --noEmit --watch"
  echo "   �o. Scripts added"
else
  echo "   �o. Scripts already exist"
fi

# Check for Next.js
if grep -q '"next"' package.json; then
  echo ""
  echo "dYZ_ Next.js project detected!"
  echo "   Updating type-check for Next.js..."
  npm pkg set scripts.type-check="next typegen && tsc --noEmit"
  echo "   �o. Next.js validation configured"
fi

# Check for tsconfig.json
if [ ! -f "tsconfig.json" ]; then
  echo ""
  echo "�s��,?  No tsconfig.json found."
  echo "   TypeScript needs this file to work properly."
  echo "   Create one with: npx tsc --init"
fi

echo ""
echo "�o. Setup complete!"
echo ""
echo "dY"< Available commands:"
echo "   npm run type-check         Validate TypeScript"
echo "   npm run type-check:watch   Watch mode"
echo "   npm run build              Production build"
echo ""
echo "dY'� Tip: Run 'npm run type-check' to test validation now"
echo ""
echo "dYZ% Your project is ready for Cursor's validation workflow!"