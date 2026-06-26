const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Get latest git tag
  const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
  
  // Write to version.ts
  const content = `export const MALIKCLAW_VERSION = "${tag}";\n`;
  const outPath = path.join(__dirname, '../src/lib/version.ts');
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
  
  console.log(`Successfully synced version ${tag} to ${outPath}`);
} catch (error) {
  console.error('Failed to sync version:', error.message);
  process.exit(1);
}
