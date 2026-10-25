import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Link from '@docusaurus/Link';
import { useEnOnlyLinkProps } from './useEnOnlyLinkProps';

function DocsLink() {
  return <Link {...useEnOnlyLinkProps('/docs/intro')}>Docs</Link>;
}

describe('useEnOnlyLinkProps', () => {
  it('should use the current locale from the Docusaurus context', () => {
    render(<DocsLink />);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs/intro');
  });
});
