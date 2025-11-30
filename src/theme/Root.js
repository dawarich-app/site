import React from 'react';
import CustomCookieConsent from '../components/CookieConsent';
// import PromoBanner from '../components/PromoBanner';

// Default implementation, that you can customize
function Root({ children }) {
  return (
    <>
      {children}
      {/* <PromoBanner /> */}
      <CustomCookieConsent />
    </>
  );
}


export default Root;
