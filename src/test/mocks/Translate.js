import React from 'react';
import { interpolate } from './Interpolate';

export function translate({ message, id }, values) {
  return interpolate(message ?? id, values);
}

export default function Translate({ children, id, values }) {
  return <>{interpolate(children ?? id, values)}</>;
}
