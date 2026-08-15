import React from 'react';

export default function BrowserOnly({ children, fallback }) {
  return children ? children() : (fallback ?? null);
}
