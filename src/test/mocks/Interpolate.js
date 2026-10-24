import React from 'react';

export function interpolate(text, values = {}) {
  return String(text).replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

export default function Interpolate({ children, values }) {
  return <>{interpolate(children, values)}</>;
}
