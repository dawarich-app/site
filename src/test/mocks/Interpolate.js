import React from 'react';

export function interpolate(text, values = {}) {
  const parts = String(text).split(/(\{\w+\})/);
  const filled = parts.map((part) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return key && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : part;
  });
  if (filled.every((part) => typeof part !== 'object')) return filled.join('');
  return filled.map((part, index) => (typeof part === 'object' ? React.cloneElement(part, { key: index }) : part));
}

export default function Interpolate({ children, values }) {
  return <>{interpolate(children, values)}</>;
}
