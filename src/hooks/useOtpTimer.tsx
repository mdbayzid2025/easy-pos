import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useOtpTimer = (resetKey: number) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const expiry = Cookies.get("otpExpiry");
    if (!expiry) return;

    const interval = setInterval(() => {
      const remaining = Number(expiry) - Date.now();

      if (remaining <= 0) {
        setSecondsLeft(0);
        clearInterval(interval);
      } else {
        setSecondsLeft(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resetKey]); // 👈 key dependency

  return secondsLeft;
};
