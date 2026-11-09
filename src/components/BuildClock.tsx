import { useEffect, useState } from 'react';

// RedCart's case study says "Dec 2025 – present", so the count starts at 1 Dec 2025 (00:00 Lagos time, UTC+1).
const START = Date.parse('2025-12-01T00:00:00+01:00');

/** Live counting clock: days and HH:MM:SS since Dec 2025, when I started building RedCart. */
export default function BuildClock() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const f = () => setMs(Date.now() - START);
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  if (ms === null) return <span className="tabular-nums">--d --:--:--</span>;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const p = (n: number) => String(n).padStart(2, '0');
  return <span className="tabular-nums">{d}d {p(Math.floor((s % 86400) / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)}</span>;
}
