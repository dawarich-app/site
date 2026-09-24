---
title: iOS App Support
description: Get help with the Dawarich iOS app — report issues, request features, and find support resources.
---

# iOS App Support

import { useEffect } from 'react';

export default function iOSAppSupport() {
  useEffect(() => {
    window.location.replace('https://github.com/dawarich-app/dawarich-ios/issues');
  }, []);

  return (
    <main className="container margin-vert--lg">
      <h1>iOS App Support</h1>
      <p>For app bugs and feature requests, visit the <a href="https://github.com/dawarich-app/dawarich-ios/issues">iOS issue tracker</a>.</p>
      <p>For installation and setup, read the <a href="/docs/dawarich-for-ios">iOS app guide</a>.</p>
    </main>
  );
}
