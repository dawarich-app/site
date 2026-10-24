import React from 'react';
import Link from '@docusaurus/Link';
import EnOnlyLink from './EnOnlyLink';
import { isEnOnlyPath } from './enOnlyLinkProps';
import { SITE_URL } from './localizedUrl';

const TOKEN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseRichText(text) {
  const tokens = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    if (match.index > last) tokens.push({ type: 'text', value: text.slice(last, match.index) });
    if (match[1] !== undefined) tokens.push({ type: 'bold', value: match[1] });
    else tokens.push({ type: 'link', value: match[2], href: match[3] });
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

export function toPlainText(text) {
  return parseRichText(text).map((token) => token.value).join('');
}

function RichLink({ href, children }) {
  const path = href.startsWith(SITE_URL) ? href.slice(SITE_URL.length) || '/' : href;
  if (!path.startsWith('/')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (isEnOnlyPath(path)) return <EnOnlyLink to={path}>{children}</EnOnlyLink>;
  return <Link to={path}>{children}</Link>;
}

export default function RichText({ text }) {
  return (
    <>
      {parseRichText(text).map((token, index) => {
        if (token.type === 'bold') return <strong key={index}>{token.value}</strong>;
        if (token.type === 'link') return <RichLink key={index} href={token.href}>{token.value}</RichLink>;
        return <React.Fragment key={index}>{token.value}</React.Fragment>;
      })}
    </>
  );
}
