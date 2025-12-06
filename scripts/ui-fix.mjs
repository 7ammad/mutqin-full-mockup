// scripts/ui-fix.mjs
// Automated fixing script for UI Police findings
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();

const FILE_GLOBS = [
  'src/app/**/*.tsx',
  'src/components/**/*.tsx',
  'src/app/_components/**/*.tsx',
];

const SPECIALTIES = [
  'Cardiology',
  'Internal Medicine',
  'Pediatrics',
  'Family Medicine',
  'Emergency Medicine',
  'Orthopedics',
  'Dermatology',
  'Neurology',
  'General Surgery',
  'Anesthesiology',
  'Pharmacy',
  'Radiology',
  'Nursing',
  'Oncology',
  'Psychiatry',
  'Endocrinology',
  'Gastroenterology',
  'Urology',
  'Ophthalmology',
  'Rheumatology',
  'Pulmonology',
  'Nephrology',
  'Hematology',
  'Infectious Diseases',
  'Obstetrics',
  'Gynecology',
  'ENT',
  'Plastic Surgery',
];

const DASHBOARD_DIR_PATTERN = /[\\/]dashboard[\\/]/i;

// Specialty to translation key mapping (matches specialties.ts)
const SPECIALTY_KEY_MAP = {
  'Cardiology': 'cardiology',
  'Pediatrics': 'pediatrics',
  'Emergency Medicine': 'emergency_medicine',
  'Family Medicine': 'family_medicine',
  'General Surgery': 'general_surgery',
  'Anesthesiology': 'anesthesiology',
  'Pharmacy': 'pharmacy',
  'Radiology': 'radiology',
  'Nursing': 'nursing',
  'Oncology': 'oncology',
  'Psychiatry': 'psychiatry',
  'Orthopedics': 'orthopedics',
  'Dermatology': 'dermatology',
  'Endocrinology': 'endocrinology',
  'Gastroenterology': 'gastroenterology',
  'Urology': 'urology',
  'Ophthalmology': 'ophthalmology',
  'Rheumatology': 'rheumatology',
  'Pulmonology': 'pulmonology',
  'Nephrology': 'nephrology',
  'Hematology': 'hematology',
  'Infectious Diseases': 'infectious_diseases',
  'Internal Medicine': 'internal_medicine',
  'Obstetrics': 'obstetrics',
  'Gynecology': 'gynecology',
  'ENT': 'ent',
  'Plastic Surgery': 'plastic_surgery',
  'Neurology': 'neurology',
};

function relative(p) {
  return path.relative(ROOT, p);
}

async function readFile(file) {
  return await fs.readFile(file, 'utf8');
}

async function writeFile(file, content) {
  await fs.writeFile(file, content, 'utf8');
}

// ---------- FIX 1: HARDCODED SPECIALTIES ----------

async function fixHardcodedSpecialties(file, content) {
  let modified = content;
  let changed = false;

  // Check if file already imports getSpecialtyLabel
  const hasImport = content.includes('getSpecialtyLabel') || content.includes('from "@/lib/i18n/specialties"');
  const hasUseLanguage = content.includes('useLanguage') || content.includes('from "@/context/LanguageContext"');
  
  // Track if we need to add import
  let needsImport = false;
  let needsLanguageImport = false;

  // Process line by line for better context awareness
  const lines = modified.split('\n');
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip comments and already-translated lines
    if (line.trim().startsWith('//') || 
        line.includes('getSpecialtyLabel') || 
        line.includes('specialties.') ||
        (line.includes('t(') && line.includes('specialty'))) {
      newLines.push(line);
      continue;
    }

    // Fix specialty strings in arrays (most common and safest case)
    // Pattern: const specialties = ['Cardiology', 'Pediatrics', ...]
    if (line.includes('[') && (line.includes('specialty') || line.includes('Specialty'))) {
      for (const [displayName, key] of Object.entries(SPECIALTY_KEY_MAP)) {
        const escapedName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const stringPattern = new RegExp(`(['"])${escapedName}\\1`, 'g');
        
        if (stringPattern.test(line)) {
          // Replace in array context: 'Cardiology' -> 'cardiology'
          line = line.replace(stringPattern, `$1${key}$1`);
          needsImport = true;
          changed = true;
        }
      }
    }

    // Fix specialty in JSX display context (more conservative)
    // Pattern: {specialty} or "Cardiology" where it's being displayed
    // Only if it's clearly a display context, not in object definitions
    if (line.includes('{') && line.includes('}') && 
        !line.includes('getSpecialtyLabel') &&
        !line.includes(':') && // Skip object properties
        !line.includes('const') && // Skip variable declarations
        !line.includes('=')) { // Skip assignments
      
      for (const [displayName, key] of Object.entries(SPECIALTY_KEY_MAP)) {
        const escapedName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const jsxStringPattern = new RegExp(`(['"])${escapedName}\\1`, 'g');
        
        // Only replace if it looks like JSX content, not a key/value
        if (jsxStringPattern.test(line) && 
            (line.includes('>') || line.includes('{'))) {
          line = line.replace(jsxStringPattern, `{getSpecialtyLabel('${key}', language)}`);
          needsImport = true;
          needsLanguageImport = true;
          changed = true;
          break; // Only replace first match per line
        }
      }
    }

    newLines.push(line);
  }

  modified = newLines.join('\n');

  // Add imports if needed
  if (needsImport && !hasImport) {
    // Find import section
    const importLines = modified.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex >= 0) {
      const importsToAdd = [];
      
      if (needsLanguageImport && !hasUseLanguage) {
        importsToAdd.push('import { useLanguage } from "@/context/LanguageContext";');
      }
      
      importsToAdd.push('import { getSpecialtyLabel } from "@/lib/i18n/specialties";');
      
      // Insert after last import
      importLines.splice(lastImportIndex + 1, 0, ...importsToAdd);
      modified = importLines.join('\n');
    }
  }

  return { content: modified, changed };
}

// ---------- FIX 2: DUPLICATE DASHBOARD HEADINGS ----------

async function fixDuplicateHeadings(file, content) {
  if (!DASHBOARD_DIR_PATTERN.test(file)) {
    return { content, changed: false };
  }

  let modified = content;
  let changed = false;

  // Pattern: H1 with text-xl/2xl/3xl that looks like a page title
  // These should be removed if PageTitle component is already used
  const h1Pattern = /<h1\s+className="[^"]*text-(xl|2xl|3xl)[^"]*"[^>]*>([^<]+)<\/h1>/g;
  const h1Matches = [...content.matchAll(h1Pattern)];
  
  // Check if PageTitle is used (from DashboardLayout)
  const hasPageTitle = content.includes('PageTitle') || file.includes('page.tsx');
  
  // Only remove if it's a standalone page.tsx file (not a tab component)
  if (hasPageTitle && file.endsWith('page.tsx') && h1Matches.length > 0) {
    // Remove H1 and its following subtitle if present
    h1Matches.forEach(match => {
      const fullMatch = match[0];
      const nextLineIndex = content.indexOf(fullMatch);
      const afterMatch = content.substring(nextLineIndex + fullMatch.length);
      
      // Check for subtitle pattern (p tag right after)
      const subtitlePattern = /<p\s+className="[^"]*text-(xs|sm)[^"]*"[^>]*>([^<]+)<\/p>/;
      const subtitleMatch = afterMatch.match(subtitlePattern);
      
      let toRemove = fullMatch;
      if (subtitleMatch) {
        toRemove += '\n' + subtitleMatch[0];
      }
      
      // Remove the heading block
      modified = modified.replace(toRemove, '');
      changed = true;
    });
  }

  // Pattern: H2 with text-xl/2xl that might be duplicate section titles
  // Be more conservative - only flag, don't auto-remove
  // (This requires manual review)

  return { content: modified, changed };
}

// ---------- FIX 3: BUTTON ALIGNMENT ----------

async function fixButtonAlignment(file, content) {
  // Button auto-fix disabled – too risky for JSX.
  // Keep this as a no-op; use UI Police + manual/Cursor fixes instead.
  return { content, changed: false };
}

// ---------- MAIN FIX FUNCTION ----------

async function fixFile(file, fixes = ['specialties', 'headings', 'buttons']) {
  const content = await readFile(file);
  let modified = content;
  let totalChanged = false;

  const results = {
    file: relative(file),
    fixes: [],
    errors: []
  };

  try {
    // Apply fixes
    if (fixes.includes('specialties')) {
      const result = await fixHardcodedSpecialties(file, modified);
      modified = result.content;
      if (result.changed) {
        results.fixes.push('specialties');
        totalChanged = true;
      }
    }

    if (fixes.includes('headings')) {
      const result = await fixDuplicateHeadings(file, modified);
      modified = result.content;
      if (result.changed) {
        results.fixes.push('headings');
        totalChanged = true;
      }
    }

    if (fixes.includes('buttons')) {
      const result = await fixButtonAlignment(file, modified);
      modified = result.content;
      if (result.changed) {
        results.fixes.push('buttons');
        totalChanged = true;
      }
    }

    // Write back if changed
    if (totalChanged) {
      await writeFile(file, modified);
      results.changed = true;
    } else {
      results.changed = false;
    }
  } catch (error) {
    results.errors.push(error.message);
  }

  return results;
}

// ---------- CLI ----------

async function main() {
  // UI Fix script is currently disabled to prevent JSX parsing errors
  console.log('⚠️  UI Fix script is disabled.');
  console.log('   Use UI Police to detect issues, then fix manually with Cursor.');
  console.log('   Run: npm run ui:police\n');
  process.exit(0);
  
  // Below code is kept for reference but won't execute
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fixType = args.find(arg => arg.startsWith('--fix='))?.split('=')[1] || 'all';
  
  const fixes = fixType === 'all'
    ? ['specialties', 'headings'] // buttons excluded by default (too risky for JSX)
    : fixType.split(',');

  const files = await fg(FILE_GLOBS, {
    cwd: ROOT,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/test-results/**'],
  });

  console.log(`🔧 UI Fix: Processing ${files.length} files...\n`);
  console.log(`Fixes enabled: ${fixes.join(', ')}\n`);
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const results = [];
  for (const file of files) {
    if (dryRun) {
      // In dry run, just check what would change
      const content = await readFile(file);
      const check = await fixFile(file, fixes);
      // Don't write, just report
      if (check.changed) {
        results.push({ ...check, wouldChange: true });
      }
    } else {
      const result = await fixFile(file, fixes);
      if (result.changed || result.fixes.length > 0) {
        results.push(result);
      }
    }
  }

  // Report results
  console.log('\n📊 Fix Results:\n');
  if (results.length === 0) {
    console.log('✅ No files needed fixes.\n');
  } else {
    results.forEach(result => {
      const status = result.changed ? '✅' : result.wouldChange ? '🔍' : '⚠️';
      console.log(`${status} ${result.file}`);
      if (result.fixes.length > 0) {
        console.log(`   Fixed: ${result.fixes.join(', ')}`);
      }
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
    });
    console.log(`\n✅ Fixed ${results.length} file(s).\n`);
  }

  if (!dryRun) {
    console.log('💡 Run "npm run ui:police" to verify fixes.\n');
  }
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});

