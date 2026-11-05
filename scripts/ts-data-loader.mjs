import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

async function resolveFile(candidate) {
  for (const value of [candidate, `${candidate}.ts`, `${candidate}.json`]) {
    try {
      const stat = await fs.stat(value);
      if (stat.isFile()) return pathToFileURL(value).href;
    } catch {}
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const resolved = await resolveFile(path.resolve(process.cwd(), specifier.slice(2)));
    if (resolved) return { url: resolved, shortCircuit: true };
  }
  if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
    const parent = path.dirname(fileURLToPath(context.parentURL));
    const resolved = await resolveFile(path.resolve(parent, specifier));
    if (resolved) return { url: resolved, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    return { format: 'module', source: `export default ${await fs.readFile(fileURLToPath(url), 'utf8')};`, shortCircuit: true };
  }
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    const source = await fs.readFile(fileURLToPath(url), 'utf8');
    const output = ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      fileName: fileURLToPath(url),
    });
    return { format: 'module', source: output.outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
