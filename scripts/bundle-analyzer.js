/**
 * Bundle size monitoring script
 * Analyzes bundle sizes and reports on performance
 */

const fs = require('fs');
const path = require('path');

const MAX_INITIAL_BUNDLE_SIZE = 200 * 1024; // 200KB in bytes (gzipped target)
const MAX_TOTAL_BUNDLE_SIZE = 1000 * 1024; // 1MB total (gzipped target)

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBundle() {
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found. Run "npm run build" first.');
    return;
  }

  const staticDir = path.join(buildDir, 'static');
  if (!fs.existsSync(staticDir)) {
    console.log('⚠️  Static directory not found.');
    return;
  }

  console.log('\n📦 Bundle Size Analysis\n');
  console.log('='.repeat(60));

  // Analyze chunks
  const chunksDir = path.join(staticDir, 'chunks');
  if (fs.existsSync(chunksDir)) {
    const files = fs.readdirSync(chunksDir);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    
    let totalSize = 0;
    const fileSizes = [];

    jsFiles.forEach(file => {
      const filePath = path.join(chunksDir, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      totalSize += size;
      fileSizes.push({ name: file, size });
    });

    // Sort by size
    fileSizes.sort((a, b) => b.size - a.size);

    console.log('\n📊 JavaScript Chunks:\n');
    fileSizes.forEach(({ name, size }) => {
      const formatted = formatBytes(size);
      const status = size > MAX_INITIAL_BUNDLE_SIZE ? '⚠️ ' : '✅';
      console.log(`${status} ${name.padEnd(40)} ${formatted.padStart(12)}`);
    });

    console.log(`\n📈 Total Bundle Size: ${formatBytes(totalSize)}`);
    
    if (totalSize > MAX_TOTAL_BUNDLE_SIZE) {
      console.log(`\n⚠️  Warning: Total bundle size exceeds target of ${formatBytes(MAX_TOTAL_BUNDLE_SIZE)}`);
      console.log('   Consider code splitting or removing unused dependencies.\n');
    } else {
      console.log(`\n✅ Total bundle size is within target.\n`);
    }
  }

  // Check for large images
  const imagesDir = path.join(staticDir, 'media');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir);
    const largeImages = [];

    imageFiles.forEach(file => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      if (stats.size > 100 * 1024) { // > 100KB
        largeImages.push({ name: file, size: stats.size });
      }
    });

    if (largeImages.length > 0) {
      console.log('🖼️  Large Images (>100KB):\n');
      largeImages.forEach(({ name, size }) => {
        console.log(`   ${name.padEnd(40)} ${formatBytes(size).padStart(12)}`);
      });
      console.log('\n💡 Consider optimizing images with next/image\n');
    }
  }

  console.log('='.repeat(60));
  console.log('\n💡 Tips for optimization:');
  console.log('   - Use React.lazy() for code splitting');
  console.log('   - Use next/image for image optimization');
  console.log('   - Remove unused dependencies');
  console.log('   - Use dynamic imports for heavy libraries\n');
}

// Run analysis
analyzeBundle();

