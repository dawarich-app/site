import React, { isValidElement } from 'react';

export function interpolate(text, values) {
  const segments = text.split(/(\{\w+\})/).map((seg, index) => {
    if (index % 2 === 1) {
      const value = values?.[seg.slice(1, -1)];
      if (value !== undefined) return value;
    }
    return seg;
  });
  if (segments.some((seg) => isValidElement(seg))) {
    return segments
      .map((seg, index) => (isValidElement(seg) ? React.cloneElement(seg, { key: index }) : seg))
      .filter((seg) => seg !== '');
  }
  return segments.join('');
}

export default function Interpolate({ children, values }) {
  return <>{interpolate(children, values)}</>;
}
