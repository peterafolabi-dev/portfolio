import { useEffect, useState } from 'react';

export default function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' }));
    f(); const id = setInterval(f, 30000); return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-sm text-cream/70">Lagos, Nigeria{t && ` · ${t}`}</span>;
}
