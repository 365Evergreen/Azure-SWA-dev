// Usage: node list-fluent-icons.cjs > fluentui-icons-table.md
const fs = require('fs');
const path = require('path');

let iconsDir;
try {
  // Dynamically resolve the package path for pnpm, npm, yarn, etc.
  const pkgPath = require.resolve('@fluentui/react-icons/package.json');
  // Try common subdirs for icon components
  const candidates = [
    path.join(path.dirname(pkgPath), 'lib-commonjs', 'components'),
    path.join(path.dirname(pkgPath), 'lib', 'components'),
    path.join(path.dirname(pkgPath), 'esm', 'components'),
  ];
  iconsDir = candidates.find(dir => fs.existsSync(dir));
  if (!iconsDir) throw new Error('No components directory found in @fluentui/react-icons');
} catch (e) {
  console.error('Could not resolve @fluentui/react-icons components directory:', e.message);
  process.exit(1);
}

const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.js'));

console.log('| Icon Name | Import Example |');
console.log('|-----------|----------------|');
files.forEach(file => {
  const name = file.replace('.js', '');
  console.log(`| ${name} | \`import { ${name} } from '@fluentui/react-icons'\` |`);
});
