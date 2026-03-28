/**
 * Google Timeline JSON splitter.
 * Splits timeline files into smaller valid chunks preserving original format.
 */

import JSZip from 'jszip';
import { detectFormat } from './timelineParser';

/**
 * Get the splittable array and wrapper factory for a given format.
 * Each format has a top-level array that holds the data; everything
 * else is structural overhead that gets duplicated in every chunk.
 *
 * @param {Object|Array} data - Parsed JSON
 * @param {string} format - Detected format string
 * @returns {{ items: Array, wrap: (items: Array) => Object|Array, overhead: number }}
 */
function getFormatAccessor(data, format) {
  // nestingDepth: how many JSON levels deep the array items sit in the wrapper.
  // For { "locations": [ ITEMS ] } that's 1 (object > array).
  // For a bare array [ ITEMS ] that's 0.
  switch (format) {
    case 'records':
      return {
        items: data.locations || [],
        wrap: (items) => ({ ...data, locations: items }),
        overhead: JSON.stringify({ ...data, locations: [] }, null, 2).length,
        nestingDepth: 1,
      };
    case 'semantic':
      return {
        items: data.timelineObjects || [],
        wrap: (items) => ({ ...data, timelineObjects: items }),
        overhead: JSON.stringify({ ...data, timelineObjects: [] }, null, 2).length,
        nestingDepth: 1,
      };
    case 'semanticSegments':
      return {
        items: data.semanticSegments || [],
        wrap: (items) => ({ ...data, semanticSegments: items }),
        overhead: JSON.stringify({ ...data, semanticSegments: [] }, null, 2).length,
        nestingDepth: 1,
      };
    case 'locationHistory':
      return {
        items: Array.isArray(data) ? data : [],
        wrap: (items) => items,
        overhead: 4,
        nestingDepth: 0,
      };
    case 'settings':
      return {
        items: data.deviceSettings || [],
        wrap: (items) => ({ ...data, deviceSettings: items }),
        overhead: JSON.stringify({ ...data, deviceSettings: [] }, null, 2).length,
        nestingDepth: 1,
      };
    case 'timelineEdits':
      return {
        items: data.timelineEdits || [],
        wrap: (items) => ({ ...data, timelineEdits: items }),
        overhead: JSON.stringify({ ...data, timelineEdits: [] }, null, 2).length,
        nestingDepth: 1,
      };
    default:
      return null;
  }
}

/**
 * Measure JSON byte size of a value (compact, no indentation).
 */
function estimateJsonSize(value) {
  return JSON.stringify(value).length;
}

/**
 * Measure the indented size of an item as it will appear nested inside the
 * output wrapper. JSON.stringify(item, null, 2) gives us the standalone
 * indented size, but in the final file each item sits inside an array that
 * is itself inside an object, so every line gets `extraIndent` extra spaces.
 *
 * @param {*} item - A single array entry
 * @param {number} nestingDepth - How many levels deep the array is in the wrapper (usually 1)
 * @returns {number} Estimated byte count including indentation and trailing comma/newline
 */
function measureItemIndented(item, nestingDepth) {
  const indented = JSON.stringify(item, null, 2);
  // Each line in the final output gets (nestingDepth + 1) * 2 extra spaces
  // because items sit inside an array inside the wrapper object.
  // +2 for trailing comma + newline between items.
  const lineCount = indented.split('\n').length;
  const extraSpaces = lineCount * (nestingDepth + 1) * 2;
  return indented.length + extraSpaces + 2;
}

/**
 * Split a Google Timeline JSON object into chunks targeting a specific file size.
 * Each chunk is a valid JSON object in the same format as the original.
 *
 * @param {Object|Array} data - Parsed Google Timeline JSON
 * @param {number} targetSizeMB - Target size per chunk in MB
 * @returns {{ chunks: Array<string>, format: string, itemCount: number, chunkCount: number }}
 */
export function splitTimeline(data, targetSizeMB) {
  const format = detectFormat(data);
  if (format === 'unknown') {
    throw new Error('Unrecognized Google Timeline format. Supported: Records.json, Semantic Location History, Semantic Segments, Location History, Settings, Timeline Edits.');
  }

  const accessor = getFormatAccessor(data, format);
  if (!accessor) {
    throw new Error(`Cannot split format: ${format}`);
  }

  const { items, wrap, overhead } = accessor;
  if (items.length === 0) {
    return {
      chunks: [JSON.stringify(wrap([]), null, 2)],
      format,
      itemCount: 0,
      chunkCount: 1,
    };
  }

  const targetBytes = targetSizeMB * 1024 * 1024;
  const budgetPerChunk = targetBytes - overhead - 100; // reserve for wrapper + safety

  // Compute exact per-item sizes so chunks respect the budget
  const sizeInfo = precomputeItemSizes(data);
  const itemSizes = sizeInfo.itemSizes;

  // Greedily pack items until adding the next one would exceed the budget
  const chunks = [];
  let chunkStart = 0;
  while (chunkStart < items.length) {
    let runningSize = 0;
    let chunkEnd = chunkStart;

    while (chunkEnd < items.length) {
      const nextSize = runningSize + itemSizes[chunkEnd];
      if (nextSize > budgetPerChunk && chunkEnd > chunkStart) break;
      runningSize = nextSize;
      chunkEnd++;
    }

    const slice = items.slice(chunkStart, chunkEnd);
    chunks.push(JSON.stringify(wrap(slice), null, 2));
    chunkStart = chunkEnd;
  }

  return {
    chunks,
    format,
    itemCount: items.length,
    chunkCount: chunks.length,
  };
}

/**
 * Pre-compute per-item serialized sizes for a parsed timeline file.
 * Call once after parsing; the result can be reused for both preview and split.
 *
 * @param {Object|Array} data - Parsed Google Timeline JSON
 * @returns {{ itemSizes: number[], overhead: number, format: string } | null}
 */
export function precomputeItemSizes(data) {
  const format = detectFormat(data);
  if (format === 'unknown') return null;

  const accessor = getFormatAccessor(data, format);
  if (!accessor) return null;

  const { items, overhead, nestingDepth } = accessor;
  const itemSizes = new Array(items.length);
  for (let i = 0; i < items.length; i++) {
    itemSizes[i] = measureItemIndented(items[i], nestingDepth);
  }

  return { itemSizes, overhead, format };
}

/**
 * Fast chunk-count estimate using pre-computed item sizes.
 *
 * @param {{ itemSizes: number[], overhead: number }} sizeInfo
 * @param {number} targetSizeMB
 * @returns {number}
 */
export function estimateChunkCount(sizeInfo, targetSizeMB) {
  if (!sizeInfo || sizeInfo.itemSizes.length === 0) return 0;

  const budgetPerChunk = targetSizeMB * 1024 * 1024 - sizeInfo.overhead - 100;
  const { itemSizes } = sizeInfo;

  let count = 0;
  let i = 0;
  while (i < itemSizes.length) {
    let runningSize = 0;
    while (i < itemSizes.length) {
      const next = runningSize + itemSizes[i];
      if (next > budgetPerChunk && runningSize > 0) break;
      runningSize = next;
      i++;
    }
    count++;
  }

  return count;
}

/**
 * Package split chunks into a ZIP file for download.
 *
 * @param {Array<string>} chunks - Array of JSON strings
 * @param {string} baseFilename - Original filename (used for naming chunks)
 * @returns {Promise<Blob>} ZIP blob
 */
export async function packageChunksAsZip(chunks, baseFilename) {
  const zip = new JSZip();
  const baseName = baseFilename.replace(/\.[^.]+$/, '');
  const padWidth = String(chunks.length).length;

  chunks.forEach((content, idx) => {
    const num = String(idx + 1).padStart(padWidth, '0');
    zip.file(`${baseName}_part${num}.json`, content);
  });

  return await zip.generateAsync({ type: 'blob' });
}
