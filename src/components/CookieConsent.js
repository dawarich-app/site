import React, { useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { saveReferralKey, clearReferralKey } from '@site/src/utils/utm';
import {
  CONSENT_COOKIE_NAME,
  denyGoogleConsent,
  grantGoogleConsent,
  hasAcceptedConsent,
  loadConsentedIntegrations,
} from '@site/src/utils/consent';

export default function CustomCookieConsent() {
  // react-cookie-consent fires onAccept only on the click itself, never on
  // mount, so without this a returning visitor who accepted months ago got
  // none of the tags they consented to. The Google tag is already handled
  // earlier by the head bootstrap, which reads the same cookie synchronously.
  useEffect(() => {
    if (!hasAcceptedConsent()) return;
    try {
      loadConsentedIntegrations();
    } catch {
      // A hardened context can refuse the append. Losing an optional tag is
      // survivable; letting the throw reach the root boundary is not.
    }
  }, []);

  const handleAccept = () => {
    // Page load refused to store the affiliate key without consent, so capture it
    // now — the referral link's query param is still on the URL at this point.
    saveReferralKey();

    // The Google tag is already loaded and denied; flip it rather than
    // appending a second loader.
    grantGoogleConsent();
    try {
      loadConsentedIntegrations();
    } catch {
      // As above: consent is recorded either way.
    }
  };

  const handleDecline = () => {
    denyGoogleConsent();
    clearReferralKey();
  };

  const buttonStyle = {
    color: "#fff",
    backgroundColor: "#1670B7",
    fontSize: "15px",
    borderRadius: "4px",
    padding: "8px 16px",
    marginLeft: "12px",
    border: "none",
    cursor: "pointer",
  };

  const declineButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: "1px solid #fff",
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Reject"
      enableDeclineButton
      cookieName={CONSENT_COOKIE_NAME}
      style={{
        background: "#2B373B",
        zIndex: 9999,
        fontSize: "16px",
        alignItems: "center",
      }}
      buttonStyle={buttonStyle}
      declineButtonStyle={declineButtonStyle}
      expires={150}
      onAccept={handleAccept}
      onDecline={handleDecline}
    >
      Our traffic statistics come from our own server, not a third party.
      Nothing is stored on your device for advertising, email or affiliate tracking unless
      you accept: Google Ads loads with storage switched off — it still tells Google which
      page you opened, but sets nothing on your device — and the Brevo and Partnero tags
      are not loaded at all, until you click "Accept".
      <a
        href="/privacy-policy#cookies"
        style={{
          textDecoration: "underline",
          color: "#fff",
          marginLeft: "5px",
        }}
      >
        Learn more
      </a>
    </CookieConsent>
  );
}
