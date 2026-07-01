/**
 * Bundle one or more files into a single .zip blob using DEFLATE compression.
 * JSZip is lazy-imported so the dependency only loads when this is called.
 */
export async function bundleFiles(files) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.blob));
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  return { blob, filename: 'dawarich-import.zip' };
}
