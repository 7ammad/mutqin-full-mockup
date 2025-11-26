#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🏥 CME Platform - Type Check Report\n');

try {
  const output = execSync('tsc --noEmit --pretty false', { 
    encoding: 'utf8',
    stdio: 'pipe' 
  });
  
  console.log('✅ No type errors found!\n');
  process.exit(0);
  
} catch (error) {
  const output = error.stdout || error.stderr || '';
  const lines = output.split('\n').filter(Boolean);
  
  const errors = [];
  const errorRegex = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/;
  
  lines.forEach(line => {
    const match = line.match(errorRegex);
    if (match) {
      errors.push({
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        code: match[4],
        message: match[5],
        component: match[1].includes('components/') ? match[1].split('components/')[1] : null,
        persona: match[1].match(/\/(hcp|organizer|vendor|regulator|eventmanager|event-manager)\//)?.[1] || null
      });
    }
  });
  
  // Group by persona
  const byPersona = errors.reduce((acc, err) => {
    const persona = err.persona || 'shared';
    if (!acc[persona]) acc[persona] = [];
    acc[persona].push(err);
    return acc;
  }, {});
  
  // Group by file
  const byFile = errors.reduce((acc, err) => {
    if (!acc[err.file]) acc[err.file] = [];
    acc[err.file].push(err);
    return acc;
  }, {});
  
  // Print report
  console.log(`❌ Found ${errors.length} type errors\n`);
  
  // Show files with most errors first
  const filesByErrorCount = Object.entries(byFile)
    .sort((a, b) => b[1].length - a[1].length);
  
  console.log('📊 Errors by File (sorted by count):');
  console.log('━'.repeat(60));
  filesByErrorCount.forEach(([file, fileErrors]) => {
    console.log(`\n${file} (${fileErrors.length} errors)`);
    fileErrors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. Line ${err.line}:${err.column} - ${err.code}: ${err.message}`);
    });
  });
  
  Object.entries(byPersona).forEach(([persona, personaErrors]) => {
    console.log(`\n\n📋 ${persona.toUpperCase()} (${personaErrors.length} errors)`);
    console.log('━'.repeat(60));
    
    personaErrors.forEach((err, idx) => {
      console.log(`\n${idx + 1}. ${err.file}`);
      console.log(`   Line ${err.line}:${err.column}`);
      console.log(`   ${err.code}: ${err.message}`);
    });
  });
  
  // Save JSON report
  const report = {
    timestamp: new Date().toISOString(),
    totalErrors: errors.length,
    byPersona,
    byFile,
    filesByErrorCount: filesByErrorCount.map(([file, fileErrors]) => ({
      file,
      errorCount: fileErrors.length,
      errors: fileErrors
    })),
    errors
  };
  
  fs.writeFileSync('cme-type-errors.json', JSON.stringify(report, null, 2));
  console.log(`\n\n💾 Full report saved to: cme-type-errors.json\n`);
  
  process.exit(1);
}

