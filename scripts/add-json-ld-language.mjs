import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CREATIVE_WORK_TYPES = new Set([
  'WebSite', 'WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'FAQPage',
  'WebApplication', 'SoftwareApplication', 'HowTo', 'Article', 'BlogPosting', 'TechArticle',
]);
const LD_JSON = /(<script[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g;

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function tagLanguage(node, lang) {
  if (Array.isArray(node)) return node.some((item) => tagLanguage(item, lang));
  if (!node || typeof node !== 'object') return false;
  let changed = node['@graph'] ? tagLanguage(node['@graph'], lang) : false;
  if (CREATIVE_WORK_TYPES.has(node['@type']) && !node.inLanguage) {
    node.inLanguage = lang;
    changed = true;
  }
  return changed;
}

export function addJsonLdLanguage(buildDir) {
  let pages = 0;
  for (const file of htmlFiles(buildDir)) {
    const html = fs.readFileSync(file, 'utf8');
    const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
    const head = html.split('</head>')[0];
    if (!lang || /name="robots" content="[^"]*noindex/.test(head)) continue;
    let changed = false;
    const next = html.replace(LD_JSON, (whole, open, body, close) => {
      let data;
      try {
        data = JSON.parse(body);
      } catch {
        return whole;
      }
      if (!tagLanguage(data, lang)) return whole;
      changed = true;
      return open + JSON.stringify(data).replace(/</g, '\\u003c') + close;
    });
    if (!changed) continue;
    fs.writeFileSync(file, next);
    pages += 1;
  }
  return pages;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pages = addJsonLdLanguage(path.resolve(process.argv[2] ?? 'build'));
  console.log(`add-json-ld-language: tagged ${pages} HTML file(s)`);
}
