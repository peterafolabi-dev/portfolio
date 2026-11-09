import { useEffect, useState } from 'react';

/** Live Lagos time, ticking every second (shows nothing until mounted so server and browser output match). */
export default function LiveTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour12: false }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || '--:--:--'} WAT</span>;
}
