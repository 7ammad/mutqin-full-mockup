const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Step 1: Generating Next.js types...');
try {
  execSync('npx next typegen', { stdio: 'inherit' });
} catch (e) {
  console.log('⚠️ next typegen not available, skipping...');
}

console.log('\n🔍 Step 2: Running comprehensive TypeScript check...');
let tscOutput = '';
try {
  execSync('npx tsc --noEmit --pretty false', { 
    stdio: 'pipe',
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024
  });
} catch (error) {
  const stdout = error.stdout ? error.stdout.toString() : '';
  const stderr = error.stderr ? error.stderr.toString() : '';
  const output = error.output ? error.output.map(o => o ? o.toString() : '').join('\n') : '';
  tscOutput = stdout || stderr || output || '';
}

console.log('\n📊 Step 3: Parsing errors...');

// Parse TypeScript errors
const errorLines = tscOutput.split('\n').filter(line => line.includes('error TS'));
const errors = [];

errorLines.forEach(line => {
  // Format: src/file.tsx(line,col): error TS2304: Cannot find name 'IconName'.
  const match = line.match(/^(.+?)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)$/);
  
  if (match) {
    const [, file, line, col, code, message] = match;
    
    // Extract icon name from "Cannot find name" errors
    const iconMatch = message.match(/Cannot find name '(\w+)'/);
    
    errors.push({
      file: file.trim(),
      line: parseInt(line),
      column: parseInt(col),
      code,
      message: message.trim(),
      iconName: iconMatch ? iconMatch[1] : null,
      category: iconMatch ? 'missing-icon-import' : 'other'
    });
  }
});

// Group by file and category
const groupedErrors = errors.reduce((acc, error) => {
  if (!acc[error.file]) {
    acc[error.file] = {
      path: error.file,
      missingIcons: [],
      otherErrors: []
    };
  }
  
  if (error.category === 'missing-icon-import') {
    acc[error.file].missingIcons.push(error.iconName);
  } else {
    acc[error.file].otherErrors.push(error);
  }
  
  return acc;
}, {});

// Generate Cursor-friendly report
const report = {
  timestamp: new Date().toISOString(),
  totalErrors: errors.length,
  totalFiles: Object.keys(groupedErrors).length,
  fileErrors: Object.values(groupedErrors).map(file => ({
    file: file.path,
    missingIcons: [...new Set(file.missingIcons)], // Remove duplicates
    otherErrorCount: file.otherErrors.length,
    otherErrors: file.otherErrors
  })).sort((a, b) => 
    (b.missingIcons.length + b.otherErrorCount) - 
    (a.missingIcons.length + a.otherErrorCount)
  )
};

// Save report
const reportPath = path.join(__dirname, '../typescript-errors-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n✅ Report generated: ${reportPath}`);
console.log(`\n📊 Summary:`);
console.log(`   Total errors: ${report.totalErrors}`);
console.log(`   Files affected: ${report.totalFiles}`);
console.log(`\n🔝 Top 5 files needing fixes:`);
report.fileErrors.slice(0, 5).forEach((f, i) => {
  console.log(`   ${i + 1}. ${f.file}`);
  if (f.missingIcons.length > 0) {
    console.log(`      Missing icons: ${f.missingIcons.join(', ')}`);
  }
  if (f.otherErrorCount > 0) {
    console.log(`      Other errors: ${f.otherErrorCount}`);
  }
});

// Generate Cursor prompt file
const cursorPrompt = `# TypeScript Error Fix Plan

**Generated:** ${new Date().toLocaleString()}
**Total Errors:** ${report.totalErrors}
**Files to Fix:** ${report.totalFiles}

## Files Prioritized by Error Count

${report.fileErrors.map((f, i) => `
### ${i + 1}. \`${f.file}\`

${f.missingIcons.length > 0 ? `**Missing Icon Imports:** ${f.missingIcons.join(', ')}

**Fix Instructions:**
1. Open file: ${f.file}
2. Find the existing lucide-react import (usually near top of file)
3. Add missing icons to import: ${f.missingIcons.join(', ')}
4. Example fix:
   \`\`\`typescript
   // Before:
   import { ExistingIcon } from "lucide-react";
   
   // After:
   import { ExistingIcon, ${f.missingIcons.join(', ')} } from "lucide-react";
   \`\`\`
` : ''}
${f.otherErrorCount > 0 ? `**Other TypeScript Errors:** ${f.otherErrorCount}

${f.otherErrors.map(e => `- Line ${e.line}: ${e.message}`).join('\n')}
` : ''}
`).join('\n')}

## Next Steps

Use Cursor Composer to fix files one by one using the prompts in PHASE 2 below.
`;

const promptPath = path.join(__dirname, '../CURSOR-FIX-PLAN.md');
fs.writeFileSync(promptPath, cursorPrompt);

console.log(`\n📝 Cursor prompt file: ${promptPath}`);
console.log(`\n🚀 Next: Open Cursor and use prompts from CURSOR-FIX-PLAN.md\n`);

process.exit(errors.length > 0 ? 1 : 0);

