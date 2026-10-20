// Read the same TypeScript data used by the site without maintaining a second
// set of catalogue prices, project facts or contact details.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
const loadDependency = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();

function readModule(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  const result = { exports: {} };
  cache.set(filename, result);
  const localRequire = (specifier) => {
    if (!specifier.startsWith('.')) return loadDependency(specifier);
    const base = path.resolve(path.dirname(filename), specifier);
    const resolved = [base, `${base}.ts`, `${base}.json`].find((candidate) => fs.existsSync(candidate));
    if (!resolved) throw new Error(`Cannot resolve ${specifier} from ${filename}`);
    return readModule(resolved);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, result, result.exports);
  return result.exports;
}

const data = readModule(path.join(root, 'src/lib/data/projects.ts'));
const { site } = readModule(path.join(root, 'src/lib/site.ts'));
process.stdout.write(JSON.stringify({
  site,
  projects: data.projects.map((project) => ({
    ...project,
    tierPriceLabels: Object.fromEntries(data.tiers.map((tier) => [tier.key, data.tierPriceLabel(project, tier.key)])),
  })),
  tiers: data.tiers,
  comparisonRows: data.comparisonRows,
}));
