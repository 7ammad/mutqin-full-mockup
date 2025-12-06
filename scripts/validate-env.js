// scripts/validate-env.js
// Build-time environment validation
// Run this script before building to ensure production safety

const fs = require('fs');
const path = require('path');

/**
 * Validate environment configuration for production builds
 */
function validateEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  
  // Trim whitespace from environment variable (handles newlines from piping)
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE ? process.env.NEXT_PUBLIC_DEMO_MODE.trim() : undefined;
  const errors = [];
  const warnings = [];
  
  if (isProduction) {
    // Production validation
    if (demoMode === undefined || demoMode === '') {
      warnings.push(
        'NEXT_PUBLIC_DEMO_MODE is not set in production. ' +
        'This will default to API mode. If you need demo mode, explicitly set NEXT_PUBLIC_DEMO_MODE=true'
      );
    } else if (demoMode === 'true') {
      warnings.push(
        'WARNING: NEXT_PUBLIC_DEMO_MODE=true in production. ' +
        'This should only be used for demo deployments, not production systems.'
      );
    } else if (demoMode !== 'false') {
      errors.push(
        `Invalid value for NEXT_PUBLIC_DEMO_MODE: "${demoMode}". ` +
        'Must be "true" or "false".'
      );
    }
  } else {
    // Development validation
    if (demoMode && demoMode !== 'true' && demoMode !== 'false') {
      errors.push(
        `Invalid value for NEXT_PUBLIC_DEMO_MODE: "${demoMode}". ` +
        'Must be "true" or "false".'
      );
    }
  }
  
  // Report results
  if (errors.length > 0) {
    console.error('\n❌ Environment Validation Errors:');
    errors.forEach((error, i) => {
      console.error(`  ${i + 1}. ${error}`);
    });
    console.error('');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Validation Warnings:');
    warnings.forEach((warning, i) => {
      console.warn(`  ${i + 1}. ${warning}`);
    });
    console.warn('');
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Environment validation passed');
  }
}

// Run validation
validateEnvironment();

