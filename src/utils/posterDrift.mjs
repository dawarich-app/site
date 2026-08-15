// Comparison core for scripts/check-poster-drift.mjs: normalizes a vendored
// poster-studio module and its Rails source so that import specifiers,
// provenance headers, whitespace and manifest-declared deltas don't count
// as drift — only real body changes do.

const IMPORT_START = /^import\b/;
const IMPORT_COMPLETE = /^import\b.*["'][^"']+["'];?\s*$/;
const IMPORT_BLOCK_END = /\bfrom\s+["'][^"']+["'];?\s*$/;
const PROVENANCE_HEADER = /^\/\/ Vendored from /;

export function normalizeModule(source, deltaPatterns = []) {
  const deltas = deltaPatterns.map((pattern) => new RegExp(pattern));
  const kept = [];
  let inImportBlock = false;

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trim();
    if (inImportBlock) {
      if (IMPORT_BLOCK_END.test(line)) inImportBlock = false;
      continue;
    }
    if (IMPORT_START.test(line)) {
      if (!IMPORT_COMPLETE.test(line)) inImportBlock = true;
      continue;
    }
    if (PROVENANCE_HEADER.test(line)) continue;
    if (line === '') continue;
    if (deltas.some((re) => re.test(line))) continue;
    kept.push(line);
  }
  return kept;
}

export function compareModules(vendored, source, deltaPatterns = []) {
  const vendoredLines = normalizeModule(vendored, deltaPatterns);
  const sourceLines = normalizeModule(source, deltaPatterns);
  const max = Math.max(vendoredLines.length, sourceLines.length);

  for (let i = 0; i < max; i += 1) {
    if (vendoredLines[i] !== sourceLines[i]) {
      return {
        clean: false,
        firstDiff: {
          line: i + 1,
          vendored: vendoredLines[i] ?? '(missing)',
          source: sourceLines[i] ?? '(missing)',
        },
      };
    }
  }
  return { clean: true };
}
