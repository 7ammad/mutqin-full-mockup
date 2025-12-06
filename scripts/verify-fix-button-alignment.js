#!/usr/bin/env node

/**
 * Button Text Alignment Verification and Fix Script
 * 
 * Verifies and fixes misaligned text inside buttons across the website.
 * 
 * Common issues checked:
 * - Missing flex/centering classes (flex items-center justify-center)
 * - Icon/text misalignment (missing gap, wrong flex direction)
 * - Text truncation issues
 * - Inconsistent padding/spacing
 * - Missing text alignment classes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');

// Standard button alignment classes that should be present
const REQUIRED_ALIGNMENT_CLASSES = {
  flex: 'flex',
  itemsCenter: 'items-center',
  justifyCenter: 'justify-center',
};

// Common alignment issues and their fixes
const ALIGNMENT_PATTERNS = {
  // Missing flex container
  missingFlex: {
    pattern: /<(Button|GlassButton)[^>]*className="([^"]*)"[^>]*>/,
    fix: (match, component, classes) => {
      if (!classes.includes('flex')) {
        return match.replace(
          `className="${classes}"`,
          `className="${classes} flex items-center justify-center".trim()`
        );
      }
      return match;
    }
  },
  // Missing items-center
  missingItemsCenter: {
    pattern: /<(Button|GlassButton)[^>]*className="([^"]*)"[^>]*>/,
    fix: (match, component, classes) => {
      if (classes.includes('flex') && !classes.includes('items-center')) {
        return match.replace(
          `className="${classes}"`,
          `${classes} items-center`.trim()
        );
      }
      return match;
    }
  },
  // Missing justify-center
  missingJustifyCenter: {
    pattern: /<(Button|GlassButton)[^>]*className="([^"]*)"[^>]*>/,
    fix: (match, component, classes) => {
      if (classes.includes('flex') && !classes.includes('justify-center')) {
        return match.replace(
          `className="${classes}"`,
          `${classes} justify-center`.trim()
        );
      }
      return match;
    }
  },
  // Icon without gap
  iconWithoutGap: {
    pattern: /<(Button|GlassButton)[^>]*>[\s\S]*?<[A-Z][^>]*className="[^"]*"[^>]*>[\s\S]*?<\/[A-Z]>[\s\S]*?[^<]+\s*<\/(Button|GlassButton)>/,
    check: (content) => {
      // Check if button has icon but no gap class
      const hasIcon = /<[A-Z][^>]*className="[^"]*"[^>]*>/.test(content);
      const hasGap = /gap-\d/.test(content);
      return hasIcon && !hasGap;
    }
  }
};

// Find all button usages in files
function findButtonFiles() {
  try {
    const result = execSync(
      `powershell -Command "Get-ChildItem -Path '${srcDir}' -Recurse -Include *.tsx,*.ts | Select-String -Pattern '<Button|<GlassButton' -List | Select-Object -ExpandProperty Path | Sort-Object -Unique"`,
      { encoding: 'utf-8' }
    );
    return result.split('\n').filter(Boolean).map(p => p.trim());
  } catch (error) {
    console.error('Error finding button files:', error.message);
    return [];
  }
}

// Analyze a single file for button alignment issues
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues = [];
    const fixes = [];

    // Find all Button and GlassButton usages
    const buttonRegex = /<(Button|GlassButton)([^>]*)>/g;
    let match;
    let lineNumber = 1;

    // Track current line for each match
    const allMatches = [];
    while ((match = buttonRegex.exec(content)) !== null) {
      const beforeMatch = content.substring(0, match.index);
      const lineNum = beforeMatch.split('\n').length;
      allMatches.push({ match, lineNum, fullMatch: match[0] });
    }

    // Analyze each button
    allMatches.forEach(({ match, lineNum, fullMatch }) => {
      const component = match[1];
      const attributes = match[2];
      
      // Extract className
      const classNameMatch = attributes.match(/className="([^"]*)"/) || 
                            attributes.match(/className=\{([^}]+)\}/);
      
      if (!classNameMatch) {
        // Button without className - add alignment classes
        // Generate fix for button without className
        const fixedMatch = fullMatch.replace(
          `>`,
          ` className="flex items-center justify-center">`
        );
        
        fixes.push({
          file: filePath,
          line: lineNum,
          original: fullMatch,
          fixed: fixedMatch,
          type: 'add-classname'
        });
        
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'missing-classname',
          severity: 'medium',
          message: `${component} without className - will add alignment classes`,
          code: fullMatch.substring(0, 80) + '...'
        });
        // Continue to next button (skip className processing)
        return;
      }

      const className = classNameMatch[1];
      
      // Check for required alignment classes
      const buttonIssues = [];
      
      if (!className.includes('flex')) {
        buttonIssues.push({
          type: 'missing-flex',
          fix: `Add 'flex items-center justify-center' to className`
        });
      } else {
        if (!className.includes('items-center')) {
          buttonIssues.push({
            type: 'missing-items-center',
            fix: `Add 'items-center' to className`
          });
        }
        if (!className.includes('justify-center')) {
          buttonIssues.push({
            type: 'missing-justify-center',
            fix: `Add 'justify-center' to className`
          });
        }
      }

      // Check for gap if button likely has icon
      // Look ahead to see if there's an icon component
      const buttonStart = match.index;
      const buttonEnd = content.indexOf('</' + component + '>', buttonStart);
      if (buttonEnd > buttonStart) {
        const buttonContent = content.substring(buttonStart, buttonEnd);
        const hasIcon = /<[A-Z][a-zA-Z]*[^>]*className="[^"]*"[^>]*>/.test(buttonContent) ||
                       /<[A-Z][a-zA-Z]*[^>]*\/>/.test(buttonContent);
        
        if (hasIcon && !className.match(/gap-[\d]/)) {
          buttonIssues.push({
            type: 'missing-gap',
            fix: `Add 'gap-2' or 'gap-3' for icon spacing`
          });
        }
      }

      // Check for text truncation issues
      if (className.includes('truncate') && !className.includes('min-w-0')) {
        buttonIssues.push({
          type: 'truncate-without-min-w',
          fix: `Add 'min-w-0' when using 'truncate' in flex container`
        });
      }

      if (buttonIssues.length > 0) {
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'alignment-issues',
          severity: 'high',
          message: `${component} has ${buttonIssues.length} alignment issue(s)`,
          issues: buttonIssues,
          code: fullMatch.substring(0, 100) + '...',
          className: className
        });

        // Generate fix
        let fixedClassName = className;
        buttonIssues.forEach(issue => {
          if (issue.type === 'missing-flex') {
            fixedClassName = `${fixedClassName} flex items-center justify-center`.trim();
          } else if (issue.type === 'missing-items-center') {
            fixedClassName = `${fixedClassName} items-center`.trim();
          } else if (issue.type === 'missing-justify-center') {
            fixedClassName = `${fixedClassName} justify-center`.trim();
          } else if (issue.type === 'missing-gap') {
            fixedClassName = `${fixedClassName} gap-2`.trim();
          } else if (issue.type === 'truncate-without-min-w') {
            fixedClassName = `${fixedClassName} min-w-0`.trim();
          }
        });

        // Clean up className (remove extra spaces)
        fixedClassName = fixedClassName.split(/\s+/).filter(Boolean).join(' ');

        fixes.push({
          file: filePath,
          line: lineNum,
          original: fullMatch,
          fixed: fullMatch.replace(classNameMatch[0], `className="${fixedClassName}"`)
        });
      }
    });

    return { issues, fixes };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return { issues: [], fixes: [] };
  }
}

// Apply fixes to a file
function applyFixes(filePath, fixes) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Sort fixes by line number (descending) to avoid offset issues
    // Sort fixes by position in file (descending) to avoid offset issues
    // For buttons without className, we need to match more precisely
    fixes.forEach(fix => {
      if (fix.type === 'add-classname') {
        // For buttons without className, match the exact opening tag
        const escapedOriginal = fix.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (content.includes(fix.original) || new RegExp(escapedOriginal).test(content)) {
          content = content.replace(fix.original, fix.fixed);
          modified = true;
        }
      } else {
        // For buttons with className, do exact match
        if (content.includes(fix.original)) {
          content = content.replace(fix.original, fix.fixed);
          modified = true;
        }
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error applying fixes to ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix') || args.includes('-f');
  const verbose = args.includes('--verbose') || args.includes('-v');

  console.log('🔍 Verifying Button Text Alignment...\n');

  const files = findButtonFiles();
  console.log(`📁 Found ${files.length} files with buttons\n`);

  let totalIssues = 0;
  let totalFixes = 0;
  const allIssues = [];
  const allFixes = [];

  files.forEach(file => {
    const { issues, fixes } = analyzeFile(file);
    totalIssues += issues.length;
    totalFixes += fixes.length;
    allIssues.push(...issues);
    allFixes.push(...fixes);

    if (verbose && issues.length > 0) {
      console.log(`\n📄 ${path.relative(srcDir, file)}:`);
      issues.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.message}`);
        if (issue.issues) {
          issue.issues.forEach(i => {
            console.log(`      - ${i.type}: ${i.fix}`);
          });
        }
      });
    }
  });

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Files checked: ${files.length}`);
  console.log(`   Buttons with issues: ${allIssues.length}`);
  console.log(`   Fixes available: ${allFixes.length}\n`);

  // Group issues by type
  const issuesByType = {};
  allIssues.forEach(issue => {
    if (issue.issues) {
      issue.issues.forEach(i => {
        issuesByType[i.type] = (issuesByType[i.type] || 0) + 1;
      });
    } else {
      issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
    }
  });

  if (Object.keys(issuesByType).length > 0) {
    console.log('📋 Issues by type:');
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    console.log('');
  }

  // Show sample issues
  if (allIssues.length > 0 && !verbose) {
    console.log('⚠️  Sample Issues (first 5):');
    allIssues.slice(0, 5).forEach(issue => {
      console.log(`\n   ${path.relative(srcDir, issue.file)}:${issue.line}`);
      console.log(`   ${issue.message}`);
      if (issue.className) {
        console.log(`   Current className: ${issue.className}`);
      }
    });
    if (allIssues.length > 5) {
      console.log(`\n   ... and ${allIssues.length - 5} more issues`);
    }
    console.log('');
  }

  // Apply fixes if requested
  if (shouldFix && allFixes.length > 0) {
    console.log('🔧 Applying fixes...\n');
    
    // Group fixes by file
    const fixesByFile = {};
    allFixes.forEach(fix => {
      if (!fixesByFile[fix.file]) {
        fixesByFile[fix.file] = [];
      }
      fixesByFile[fix.file].push(fix);
    });

    let filesModified = 0;
    Object.entries(fixesByFile).forEach(([file, fixes]) => {
      if (applyFixes(file, fixes)) {
        filesModified++;
        console.log(`   ✓ Fixed ${fixes.length} issue(s) in ${path.relative(srcDir, file)}`);
      }
    });

    console.log(`\n✅ Fixed ${allFixes.length} issue(s) in ${filesModified} file(s)\n`);
  } else if (allFixes.length > 0) {
    console.log('💡 Run with --fix to automatically apply fixes\n');
  }

  // Exit code
  if (allIssues.length === 0) {
    console.log('✅ All buttons have proper alignment!\n');
    process.exit(0);
  } else {
    console.log(`❌ Found ${allIssues.length} alignment issue(s)\n`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, applyFixes };

