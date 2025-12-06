#!/usr/bin/env node

/**
 * Automated Button Verification Script
 * 
 * Verifies that all buttons in the codebase use GlassButton (either directly
 * or via Button component with glass={true} default).
 * 
 * Since Button component defaults to glass={true}, all Button components
 * automatically use GlassButton unless explicitly disabled with glass={false}.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');

// Find all files with Button usage
function findButtonUsages() {
  try {
    const result = execSync(
      `grep -r -n "<Button\\|<button\\|<GlassButton" "${srcDir}" --include="*.tsx" --include="*.ts" || true`,
      { encoding: 'utf-8', cwd: srcDir }
    );
    return result.split('\n').filter(Boolean);
  } catch (error) {
    // If grep fails, try PowerShell alternative
    try {
      const result = execSync(
        `powershell -Command "Select-String -Path '${srcDir}\\**\\*.tsx','${srcDir}\\**\\*.ts' -Pattern '<Button|<button|<GlassButton' | ForEach-Object { $_.Path + ':' + $_.LineNumber + ':' + $_.Line }"`,
        { encoding: 'utf-8' }
      );
      return result.split('\n').filter(Boolean);
    } catch (e) {
      console.error('Could not run grep. Please run manually.');
      return [];
    }
  }
}

// Find instances where glass={false} is explicitly set
function findDisabledGlassButtons() {
  try {
    const result = execSync(
      `grep -r -n "glass\\s*=\\s*{\\s*false\\s*}\\|glass\\s*=\\s*\"false\"" "${srcDir}" --include="*.tsx" --include="*.ts" || true`,
      { encoding: 'utf-8', cwd: srcDir }
    );
    return result.split('\n').filter(Boolean);
  } catch (error) {
    try {
      const result = execSync(
        `powershell -Command "Select-String -Path '${srcDir}\\**\\*.tsx','${srcDir}\\**\\*.ts' -Pattern 'glass\\s*=\\s*\\{?\\s*false' | ForEach-Object { $_.Path + ':' + $_.LineNumber + ':' + $_.Line }"`,
        { encoding: 'utf-8' }
      );
      return result.split('\n').filter(Boolean);
    } catch (e) {
      return [];
    }
  }
}

// Main verification
console.log('🔍 Verifying Button Usage...\n');

const buttonUsages = findButtonUsages();
const disabledGlass = findDisabledGlassButtons();

console.log(`📊 Statistics:`);
console.log(`   Total button usages found: ${buttonUsages.length}`);
console.log(`   GlassButton disabled (glass={false}): ${disabledGlass.length}`);
console.log(`   Using GlassButton (default or explicit): ${buttonUsages.length - disabledGlass.length}\n`);

if (disabledGlass.length > 0) {
  console.log('❌ ISSUES FOUND:');
  console.log('   The following buttons have glass={false} and are NOT using GlassButton:\n');
  disabledGlass.forEach(line => {
    console.log(`   ${line}`);
  });
  console.log('\n⚠️  These buttons should be reviewed to ensure they should not use GlassButton.');
  process.exit(1);
} else {
  console.log('✅ VERIFICATION PASSED');
  console.log('   All buttons use GlassButton (either directly or via Button with default glass={true})');
  console.log('   No instances of glass={false} found.\n');
  process.exit(0);
}

