import React, { useEffect, useState } from 'react';
import {
  CONSENT_ACCEPTED,
  CONSENT_DECLINED,
  readConsentChoice,
  revokeConsent,
} from '@site/src/utils/consent';
import { clearReferralKey } from '@site/src/utils/utm';

const buttonStyle = {
  color: '#fff',
  backgroundColor: '#1670B7',
  fontSize: '15px',
  fontWeight: 'bold',
  borderRadius: '5px',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
};

export default function CookiePreferences({ reload = () => window.location.reload() }) {
  // The prerendered HTML cannot know what this visitor chose, so the cookie is
  // read after mount and the first client render matches the server's.
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    setChoice(readConsentChoice());
  }, []);

  // Both buttons do the same thing: drop the stored answer, re-deny Google, and
  // reload. Brevo and Partnero are already executing and cannot be unloaded, and
  // the banner reads its cookie only when it first mounts — which Docusaurus
  // never does again during client-side navigation.
  // clearReferralKey lives in utm.js, which already reads consent.js — calling it
  // from here rather than from revokeConsent keeps that dependency one-way.
  const startOver = () => {
    revokeConsent();
    clearReferralKey();
    reload();
  };

  // Before the cookie has been read — the prerendered page, and any visit
  // without JavaScript — only the manual route can be offered honestly.
  if (choice === null) {
    return (
      <p>
        Delete the <code>dawarichCookieConsent</code> cookie and reload the page. With
        JavaScript enabled, a one-click button appears here instead.
      </p>
    );
  }

  if (choice === CONSENT_ACCEPTED) {
    return (
      <button type="button" style={buttonStyle} onClick={startOver}>
        Withdraw consent
      </button>
    );
  }

  if (choice === CONSENT_DECLINED) {
    return (
      <p>
        You declined, so nothing is stored on your device for advertising, email or
        affiliate tracking. To reconsider:{' '}
        <button type="button" style={buttonStyle} onClick={startOver}>
          Choose again
        </button>
      </p>
    );
  }

  return (
    <p>
      The cookie banner is still waiting for your answer, so nothing is stored on your
      device for advertising, email or affiliate tracking.
    </p>
  );
}
