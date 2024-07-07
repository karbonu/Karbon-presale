import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReferralRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('referralCode')) {
      const url = new URL(currentUrl);
      const referralCode = url.searchParams.get('referralCode');
      if (referralCode) {
        localStorage.setItem('referralCode', referralCode);
        navigate('/signup');
      }
    }
  }, []);

  return null; 
};

export default ReferralRedirect;
