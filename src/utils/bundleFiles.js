/**
 * Bundle one or more files into a single .zip blob using DEFLATE compression.
 * JSZip is lazy-imported so the dependency only loads when this is called.
 * Duplicate filenames are uniquified (zip.file overwrites same-named entries,
 * which would silently drop files from multi-device uploads).
 */
export async function bundleFiles(files) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const used = new Set();

  files.forEach((f) => {
    let name = f.name;
    for (let i = 1; used.has(name); i++) {
      name = dedupedName(f.name, i);
    }
    used.add(name);
    zip.file(name, f.blob);
  });

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  return { blob, filename: 'dawarich-import.zip' };
}

function dedupedName(name, count) {
  const dot = name.lastIndexOf('.');
  if (dot <= 0) return `${name}_${count}`;
  return `${name.slice(0, dot)}_${count}${name.slice(dot)}`;
}
