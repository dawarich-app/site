import React from 'react';
import Link from '@docusaurus/Link';
import { useEnOnlyLinkProps } from './useEnOnlyLinkProps';

export default function EnOnlyLink({ to, ...props }) {
  return <Link {...props} {...useEnOnlyLinkProps(to)} />;
}
