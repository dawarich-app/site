import React from 'react';
import CookieConsent from 'react-cookie-consent';

export default function CustomCookieConsent() {
  const handleAccept = () => {
    const gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17899851408';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    gtagScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17899851408');
    };

    const brevoScript = document.createElement('script');
    brevoScript.src = 'https://cdn.brevo.com/js/sdk-loader.js';
    brevoScript.async = true;
    document.head.appendChild(brevoScript);

    brevoScript.onload = () => {
      window.Brevo = window.Brevo || [];
      window.Brevo.push([
        "init",
        {
          client_key: "pe4hklelof20ofjrbum6bcx8"
        }
      ]);
    };
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
      cookieName="dawarichCookieConsent"
      domain=".dawarich.app"
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
    >
      We use a cookieless analytics service (Simple Analytics) that requires no consent.
      You can optionally accept cookies for Google Ads conversion tracking and Brevo email
      analytics — these only load if you click "Accept".
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
