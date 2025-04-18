import React from 'react';
import CustomCookieConsent from '../components/CookieConsent';

// Default implementation, that you can customize
function Root({children}) {
  return (
    <>
      {children}
      <CustomCookieConsent />
    </>
  );
}

export default Root;
