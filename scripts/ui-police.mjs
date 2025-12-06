// scripts/ui-police.mjs
import fg from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();

// Adjust globs if your structure differs
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

// card heuristics
const CARD_FILE_HINT = /(Card\.tsx$|[\\/](cards?|Card)[\\/])/;
const CARD_WRAPPER_CLASS_HINT =
  /(bg-card|bg-background|bg-muted|border).*rounded|shadow-(sm|md|lg|xl)/;

// typography utilities
const TEXT_CLASS_REGEX = /text-(xs|sm|base|lg|xl|2xl|3xl|4xl)\b/;
const FONT_CLASS_REGEX =
  /font-(light|normal|medium|semibold|bold|extrabold|black)\b/;

// RTL / landing heuristics
const LANDING_PATH_HINT = /[\\/]landing[\\/]/i;
const AR_LOCALE_HINT = /\b(locale\s*===?\s*['"]ar['"]|'ar-SA'|"ar"|\bt\(['"]landing\.)/;

function relative(p) {
  return path.relative(ROOT, p);
}

async function readFileLines(file) {
  const content = await fs.readFile(file, 'utf8');
  return content.split(/\r?\n/);
}

function report(category, file, lineNumber, line) {
  console.log(
    `[${category}] ${relative(file)}:${lineNumber}\n  ${line.trim()}\n`
  );
}

// ---------- CONTRAST ----------

async function auditContrast(file) {
  const lines = await readFileLines(file);

  const darkBg = /(bg-(slate|gray|neutral|zinc)-(800|900|950)|bg-black)/;
  const lightBg = /(bg-(white|slate-50|gray-50|neutral-50|zinc-50))/;
  const darkText = /(text-(slate|gray|neutral|zinc)-(800|900|950)|text-black)/;
  const lightText = /(text-(white|slate-50|gray-50|neutral-50|zinc-50))/;

  lines.forEach((line, idx) => {
    if (!line.includes('className')) return;

    const hasDarkBg = darkBg.test(line);
    const hasLightBg = lightBg.test(line);
    const hasDarkText = darkText.test(line);
    const hasLightText = lightText.test(line);

    if ((hasDarkBg && hasDarkText) || (hasLightBg && hasLightText)) {
      report('LOW_CONTRAST?', file, idx + 1, line);
    }
  });
}

// ---------- BUTTONS ----------

async function auditButtons(file) {
  const lines = await readFileLines(file);

  lines.forEach((line, idx) => {
    const hasButtonTag =
      line.includes('<button') || line.includes('<Button ') || line.includes('<Button>');
    if (!hasButtonTag) return;

    const looksCentered =
      line.includes('items-center') && line.includes('justify-center');

    if (!looksCentered) {
      report('BUTTON_ALIGNMENT?', file, idx + 1, line);
    }
  });
}

// ---------- HARDCODED SPECIALTIES ----------

async function auditHardcodedSpecialties(file) {
  const lines = await readFileLines(file);

  lines.forEach((line, idx) => {
    // Skip if it's in a comment or string that's clearly a translation key
    if (line.trim().startsWith('//') || line.includes('getSpecialtyLabel') || line.includes('specialties.')) {
      return;
    }

    for (const spec of SPECIALTIES) {
      // Check for exact match (not part of a larger word)
      const regex = new RegExp(`\\b${spec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (regex.test(line)) {
        report('HARDCODED_SPECIALTY', file, idx + 1, line);
        break;
      }
    }
  });
}

// ---------- DASHBOARD HEADINGS (DOUBLE TITLES) ----------

async function auditHeadingsInDashboard(file) {
  if (!DASHBOARD_DIR_PATTERN.test(file)) return;

  const lines = await readFileLines(file);

  let h1Count = 0;
  let h2Count = 0;

  lines.forEach((line, idx) => {
    if (line.includes('<h1')) {
      h1Count++;
      report('DASHBOARD_HEADING_H1', file, idx + 1, line);
    }
    if (line.includes('<h2')) {
      h2Count++;
      // Only report if it looks like a page title (large text)
      if (line.includes('text-2xl') || line.includes('text-3xl') || line.includes('text-xl')) {
        report('DASHBOARD_HEADING_H2', file, idx + 1, line);
      }
    }
  });

  if (h1Count > 1 || h2Count > 2) {
    console.log(
      `[DASHBOARD_TITLES] ${relative(
        file
      )} has h1=${h1Count}, h2=${h2Count} (check for double titles / fake dashboards)\n`
    );
  }
}

// ---------- CARDS: LAYOUT & TYPOGRAPHY ----------

async function auditCards(file) {
  const isCardFile = CARD_FILE_HINT.test(file);
  const lines = await readFileLines(file);

  let cardTypoCount = 0;

  lines.forEach((line, idx) => {
    const ln = idx + 1;

    // card wrapper heuristics (alignment/padding)
    if (line.includes('className') && CARD_WRAPPER_CLASS_HINT.test(line)) {
      const isFlex = /\bflex\b/.test(line);
      const hasGap = /\bgap-[0-9]/.test(line);
      const hasPadding = /\bp[xy]?-?[0-9]/.test(line);

      if (!isFlex || !hasGap || !hasPadding) {
        report('CARD_LAYOUT?', file, ln, line);
      }
    }

    // typography inside card files
    if (isCardFile && (TEXT_CLASS_REGEX.test(line) || FONT_CLASS_REGEX.test(line))) {
      cardTypoCount++;

      report('CARD_TYPOGRAPHY', file, ln, line);
    }
  });

  if (isCardFile && cardTypoCount > 10) {
    console.log(
      `[CARD_TYPOGRAPHY_DENSE] ${relative(
        file
      )} has ${cardTypoCount} text/font utility usages (check font scale/weights are consistent).`
    );
  }
}

// ---------- RTL / LANDING ALIGNMENT ----------

async function auditRTL(file) {
  const lines = await readFileLines(file);

  const hasDirRtl = lines.some((l) => l.includes('dir="rtl"') || l.includes("dir='rtl'"));
  const isLandingFile = LANDING_PATH_HINT.test(file);
  const hasArLocaleHints = lines.some((l) => AR_LOCALE_HINT.test(l));

  const rtlSensitive = hasDirRtl || isLandingFile || hasArLocaleHints;
  if (!rtlSensitive) return;

  lines.forEach((line, idx) => {
    const ln = idx + 1;
    const hasTextLeft = /\btext-left\b/.test(line);
    const hasJustifyStart = /\bjustify-start\b/.test(line);
    const hasItemsStart = /\bitems-start\b/.test(line);

    // Skip if it's conditional (e.g., language === 'en' ? 'text-left' : 'text-right')
    const isConditional = line.includes('?') && (line.includes('text-right') || line.includes('text-left'));
    
    // we don't auto-fix, we just flag "check this"
    if ((hasTextLeft || hasJustifyStart || hasItemsStart) && !isConditional) {
      report('RTL_ALIGNMENT?', file, ln, line);
    }
  });
}

// ---------- MAIN ----------

async function main() {
  const files = await fg(FILE_GLOBS, {
    cwd: ROOT,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**', '**/test-results/**'],
  });

  console.log(`UI Police: scanning ${files.length} files...\n`);

  for (const file of files) {
    await auditContrast(file);
    await auditButtons(file);
    await auditHardcodedSpecialties(file);
    await auditHeadingsInDashboard(file);
    await auditCards(file);
    await auditRTL(file);
  }

  console.log('UI Police audit complete. Review findings above and fix in code.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

