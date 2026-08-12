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

    // Affiliate attribution. The cookie this sets is not strictly necessary
    // under § 25 TTDSG, so it waits for consent like the two above. Attribution
    // itself does not depend on it — the `via` key travels to the app on the
    // CTA URL (see src/utils/utm.js), so declining costs Partnero only its own
    // click statistics.
    (function (p, t, n, e, r, o) {
      p['__partnerObject'] = r;
      function f() {
        var c = { a: arguments, q: [] };
        var r = this.push(c);
        return typeof r != "number" ? r : f.bind(c.q);
      }
      f.q = f.q || [];
      p[r] = p[r] || f.bind(f.q);
      p[r].q = p[r].q || f.q;
      o = t.createElement(n);
      var _ = t.getElementsByTagName(n)[0];
      o.async = 1;
      o.src = e + '?v' + (~~(new Date().getTime() / 1e6));
      _.parentNode.insertBefore(o, _);
    })(window, document, 'script', 'https://app.partnero.com/js/universal.js', 'po');
    window.po('settings', 'assets_host', 'https://assets.partnero.com');
    window.po('program', '1NNVU1NU', 'load');
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
      You can optionally accept cookies for Google Ads conversion tracking, Brevo email
      analytics and affiliate referral credit — these only load if you click "Accept".
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
