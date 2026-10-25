import React from 'react';
import Layout from '@theme-original/Layout';
import EnglishContent from '@site/src/i18n/EnglishContent';

export default function LayoutWrapper({ children, ...props }) {
  return (
    <Layout {...props}>
      <EnglishContent>{children}</EnglishContent>
    </Layout>
  );
}
