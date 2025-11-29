import React, { useState, useEffect, useCallback } from 'react';

export const useIdleTimeout = (onIdle, timeout = 15 * 60 * 1000, warningTime = 2 * 60 * 1000) => {
  const [isIdle, setIsIdle] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const idleTimer = React.useRef();
  const warningTimer = React.useRef();

  const handleIdle = useCallback(() => {
    setIsIdle(true);
    onIdle();
  }, [onIdle]);

  const handleWarning = useCallback(() => {
    setShowWarning(true);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimeout(idleTimer.current);
    clearTimeout(warningTimer.current);

    warningTimer.current = setTimeout(handleWarning, timeout - warningTime);
    idleTimer.current = setTimeout(handleIdle, timeout);

    setShowWarning(false);
    setIsIdle(false);
  }, [handleIdle, handleWarning, timeout, warningTime]);

  const stayActive = () => {
    resetTimers();
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    const handleActivity = () => {
      resetTimers();
    };

    // Set initial timers
    resetTimers();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(idleTimer.current);
      clearTimeout(warningTimer.current);
    };
  }, [resetTimers]);

  return { showWarning, stayActive };
};