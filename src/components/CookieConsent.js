import React from 'react';
import CookieConsent from 'react-cookie-consent';

export default function CustomCookieConsent() {
  const handleAccept = () => {
    // Load Google Tag Manager after consent
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

    // Load Brevo tracking script after consent
    const brevoScript = document.createElement('script');
    brevoScript.src = 'https://cdn.brevo.com/js/sdk-loader.js';
    brevoScript.async = true;
    document.head.appendChild(brevoScript);

    // Initialize Brevo after script loads
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
      onAccept={handleAccept}
    >
      We use essential cookies required for login, security, and purchases. We also use Google Ads for conversion tracking and Brevo for email analytics, which only load after you accept.
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
