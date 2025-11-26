#!/bin/bash

echo "dY", Applying TypeScript validation workflow to current project..."
echo ""

TEMPLATE_DIR=~/cursor-typescript-template

# Check if template exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "�?O Template not found at: $TEMPLATE_DIR"
  echo "   Please run the setup first to create the template."
  exit 1
fi

# Check if we're in a project directory
if [ ! -d ".git" ] && [ ! -f "package.json" ]; then
  echo "�s��,?  This doesn't look like a project directory."
  echo "   Make sure you're in the project root (has .git or package.json)"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Copy template files
echo "dY"? Copying template files..."

# .cursor/rules directory
if [ ! -d ".cursor/rules" ]; then
  echo "   Creating .cursor/rules/"
  mkdir -p .cursor/rules
fi

echo "   Copying error-fixing.mdc..."
cp "$TEMPLATE_DIR/.cursor/rules/error-fixing.mdc" .cursor/rules/

echo "   Copying implementation.mdc..."
cp "$TEMPLATE_DIR/.cursor/rules/implementation.mdc" .cursor/rules/

# .cursorrules file (don't overwrite if exists)
if [ ! -f ".cursorrules" ]; then
  echo "   Creating .cursorrules..."
  cp "$TEMPLATE_DIR/.cursorrules" .
else
  echo "   �s��,?  .cursorrules already exists, skipping (not overwriting)"
fi

# scripts directory
if [ ! -d "scripts" ]; then
  echo "   Creating scripts/"
  mkdir -p scripts
fi

echo "   Copying setup script..."
cp "$TEMPLATE_DIR/scripts/setup-validation.sh" scripts/
chmod +x scripts/setup-validation.sh

# docs directory
if [ ! -d "docs" ]; then
  echo "   Creating docs/"
  mkdir -p docs
fi

if [ -f "$TEMPLATE_DIR/docs/cursor-workflow.md" ]; then
  echo "   Copying documentation..."
  cp "$TEMPLATE_DIR/docs/cursor-workflow.md" docs/
fi

echo ""
echo "�o. Template files copied!"
echo ""

# Run validation setup
echo "dY"� Setting up validation scripts..."
bash scripts/setup-validation.sh

echo ""
echo "dYZ% Workflow applied to current project!"
echo ""
echo "dY"< Next steps:"
echo "   1. Open project in Cursor: cursor ."
echo "   2. Test validation: npm run type-check"
echo "   3. Start coding - Cursor will guide validation automatically"
echo ""