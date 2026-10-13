import React, { useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { saveOriginalUtmParams, clearOriginalUtmParams, saveReferralKey, clearReferralKey, refreshOutboundLinks } from '@site/src/utils/utm';
import {
  CONSENT_COOKIE_NAME,
  denyGoogleConsent,
  grantGoogleConsent,
  hasAcceptedConsent,
  loadConsentedIntegrations,
  syncAttributionConsent,
} from '@site/src/utils/consent';

export default function CustomCookieConsent() {
  // react-cookie-consent fires onAccept only on the click itself, never on
  // mount, so without this a returning visitor who accepted months ago got
  // none of the tags they consented to.
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
    saveOriginalUtmParams();
    // Page load refused to store the affiliate key without consent, so capture it
    // now — the referral link's query param is still on the URL at this point.
    saveReferralKey();
    refreshOutboundLinks();

    try {
      loadConsentedIntegrations();
      grantGoogleConsent();
    } catch {
      // As above: consent is recorded either way.
    }
  };

  const handleDecline = () => {
    denyGoogleConsent();
    syncAttributionConsent();
    clearOriginalUtmParams();
    clearReferralKey();
    refreshOutboundLinks();
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
      Optional site analytics, advertising, email and affiliate trackers run only
      after you accept. Rejecting keeps them off and disables campaign handoff.
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
