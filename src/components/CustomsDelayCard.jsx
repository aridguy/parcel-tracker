import React, { useState, useEffect } from 'react';

// Replace with your actual SheetDB API ID
const SHEETDB_URL = 'https://sheetdb.io/api/v1/YOUR_API_ID';

export default function CustomsDelayCard() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    async function fetchDeadlineAndStartTimer() {
      try {
        setIsLoading(true);
        // 1. Fetch the row containing the deadline
        const response = await fetch(`${SHEETDB_URL}?limit=1`);
        const data = await response.json();

        if (!data || data.length === 0 || !data[0].deadline) {
          throw new Error("Deadline not found in database.");
        }

        // 2. Parse the stored deadline (assume ISO string or timestamp)
        const deadline = new Date(data[0].deadline).getTime();
        
        // 3. Start the interval
        intervalId = setInterval(() => {
          const now = new Date().getTime();
          const distance = deadline - now;

          if (distance < 0) {
            clearInterval(intervalId);
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            // Optionally handle expiration (e.g., show "Expired" message)
            return;
          }

          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft({ hours, minutes, seconds });
        }, 1000);

      } catch (err) {
        console.error(err);
        setError("Unable to load timer data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeadlineAndStartTimer();

    // Cleanup: stop the timer if the component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Helper to pad single digits with a zero
  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="cpc">
      <div className="cpc-label">
        <span className="cpc-label__icon" aria-hidden="true">⚠</span>
        Attention
      </div>

      <p className="cpc-message">
        Due to a delay with your pickup, a <strong>customs delay fee of $4,000.00</strong> has been
        placed on your parcel. This charge must be paid within <strong>74 working hours</strong>.
      </p>

      <div className="cpc-countdown">
        <p className="cpc-countdown__title">Time remaining to pay</p>
        {isLoading ? (
          <p>Loading timer...</p>
        ) : error ? (
          <p style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{error}</p>
        ) : (
          <div className="cpc-timer">
            <div className="cpc-timer__unit">
              <span className="cpc-timer__value">{pad(timeLeft.hours)}</span>
              <span className="cpc-timer__label">Hours</span>
            </div>
            <span className="cpc-timer__sep">:</span>
            <div className="cpc-timer__unit">
              <span className="cpc-timer__value">{pad(timeLeft.minutes)}</span>
              <span className="cpc-timer__label">Minutes</span>
            </div>
            <span className="cpc-timer__sep">:</span>
            <div className="cpc-timer__unit">
              <span className="cpc-timer__value">{pad(timeLeft.seconds)}</span>
              <span className="cpc-timer__label">Seconds</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}