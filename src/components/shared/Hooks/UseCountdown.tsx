import { useState, useEffect, useCallback } from 'react';

const useCountdown = (start: Date, end: Date) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [saleStatus, setSaleStatus] = useState('SALE STARTS IN');
  const [isPaused, setIsPaused] = useState(false);

  const updateCountdown = useCallback(() => {
    if (isPaused) return;

    const now = new Date();
    let distance = start.getTime() - now.getTime();

    if (distance > 0) {
      setSaleStatus('SALE STARTS IN');
    } else {
      distance = end.getTime() - now.getTime();
      setSaleStatus('SALE ENDS IN');
    }

    if (distance < 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    setCountdown({ days, hours, minutes, seconds });
  }, [start, end, isPaused]);

  useEffect(() => {
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [updateCountdown]);

  const pauseCountdown = () => setIsPaused(true);
  const resumeCountdown = () => setIsPaused(false);

  return { countdown, saleStatus, pauseCountdown, resumeCountdown };
};

export default useCountdown;
