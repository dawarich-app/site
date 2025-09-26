import React from 'react';
import CookieConsent from 'react-cookie-consent';

export default function CustomCookieConsent() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="dawarichCookieConsent"
      domain=".dawarich.app"
      style={{
        background: "#2B373B",
        zIndex: 9999,
        fontSize: "16px",
        alignItems: "center"
      }}
      buttonStyle={{
        color: "#fff",
        backgroundColor: "#1670B7",
        fontSize: "15px",
        borderRadius: "4px",
        padding: "8px 16px",
        marginLeft: "20px"
      }}
      expires={150}
      debug={true}
    >
      We use essential cookies required for login, security, and purchases. These cookies cannot be disabled. We do not use advertising cookies, but we do use analytics cookies from PostHog to help us improve our website.
      <a
        href="/privacy-policy"
        style={{
          textDecoration: "underline",
          color: "#fff",
          marginLeft: "5px"
        }}
      >
        Learn more
      </a>
    </CookieConsent>
  );
}
