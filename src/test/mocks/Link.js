import React from 'react';

export default function Link({ to, href, autoAddBaseUrl, children, ...props }) {
  return (
    <a href={to ?? href} {...props}>
      {children}
    </a>
  );
}
