import { useEffect, useMemo, useState } from 'react';

/** A tiny, real hash-chained ledger (same idea as Oja Ledger): edit an amount and watch the chain break. */
interface Row { memo: string; kobo: number; prev: string; hash: string }
const START: { memo: string; kobo: number }[] = [
  { memo: 'Sold 12 bags of rice', kobo: 4_800_000 },
  { memo: 'Restocked from the depot', kobo: -3_000_000 },
  { memo: 'Transfer from a customer', kobo: 2_150_000 },
  { memo: 'Paid for transport', kobo: -350_000 },
];
const GENESIS = '0'.repeat(64);

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const seal = (seq: number, prev: string, memo: string, kobo: number) => sha256(`${seq}|${prev}|${memo}|${kobo}`);
async function sealAll(items: { memo: string; kobo: number }[]): Promise<Row[]> {
  const rows: Row[] = [];
  let prev = GENESIS;
  for (let i = 0; i < items.length; i++) {
    const hash = await seal(i + 1, prev, items[i].memo, items[i].kobo);
    rows.push({ ...items[i], prev, hash });
    prev = hash;
  }
  return rows;
}
const naira = (k: number) => `${k < 0 ? '−' : ''}₦${(Math.abs(k) / 100).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
const short = (h: string) => `${h.slice(0, 4)} ${h.slice(4, 8)} ${h.slice(8, 12)}`;

type Status = { kind: 'ok' } | { kind: 'changed' } | { kind: 'link' };

export default function TamperDemo() {
  const [supported] = useState(() => typeof crypto !== 'undefined' && !!crypto.subtle);
  const [stored, setStored] = useState<Row[]>([]);   // what was written when each entry was recorded
  const [noted, setNoted] = useState('');            // the fingerprint the owner wrote down
  const [edits, setEdits] = useState<Record<number, number>>({});  // visitor's changes (naira) by index
  const [live, setLive] = useState<string[]>([]);    // recomputed hashes of the (possibly edited) entries

  useEffect(() => {
    if (!supported) return;
    sealAll(START).then((r) => { setStored(r); setNoted(r.at(-1)!.hash); });
  }, [supported]);

  const current = useMemo(() => stored.map((r, i) => ({ memo: r.memo, kobo: edits[i] !== undefined ? edits[i] * 100 : r.kobo })), [stored, edits]);

  // verify: recompute each hash from the current amounts and the STORED previous hash, like verifyChain() does
  useEffect(() => {
    if (!stored.length) return;
    let live = true;
    (async () => {
      const out: string[] = [];
      for (let i = 0; i < stored.length; i++) out.push(await seal(i + 1, stored[i].prev, current[i].memo, current[i].kobo));
      if (live) setLive(out);
    })();
    return () => { live = false; };
  }, [stored, current]);

  const status: Status[] = stored.map((r, i) => {
    if (live[i] && live[i] !== r.hash) return { kind: 'changed' };
    return { kind: 'ok' };
  });
  const firstBad = status.findIndex((s) => s.kind !== 'ok');
  const headNow = stored.at(-1)?.hash ?? '';
  const chainOk = firstBad === -1;
  const fingerprintMatches = headNow === noted;
  const edited = Object.keys(edits).length > 0;

  const forge = async () => {
    // what a forger with access to the device would do: recompute every hash from the edited amounts
    const items = current.map((c) => ({ memo: c.memo, kobo: c.kobo }));
    setStored(await sealAll(items));
    setEdits({});
  };
  const reset = async () => { const r = await sealAll(START); setStored(r); setEdits({}); setNoted(r.at(-1)!.hash); };

  if (!supported) return <p className="card p-6 text-cream/90">This demo needs a secure (https) page to use the browser’s SHA-256.</p>;

  return (
    <div className="card overflow-hidden">
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-white/[.14] px-5 py-4 sm:px-6 ${chainOk ? (fingerprintMatches ? 'bg-teal/10' : 'bg-amber/10') : 'bg-accent/15'}`} role="status" aria-live="polite">
        <p className="text-sm font-medium sm:text-base">
          {!chainOk
            ? `✗ Entry #${firstBad + 1} was changed after it was recorded`
            : fingerprintMatches
              ? '✓ Books balanced and sealed'
              : '⚠ Chain is valid again, but the fingerprint is not the one you wrote down'}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-cream/75">Fingerprint now: {headNow ? short(headNow) : '…'}</p>
      </div>

      <ol className="divide-y divide-white/[.12]">
        {stored.map((r, i) => {
          const s = status[i] ?? { kind: 'ok' };
          const bad = s.kind !== 'ok';
          const amount = edits[i] !== undefined ? edits[i] : r.kobo / 100;
          return (
            <li key={i} className={`grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 gap-y-1 px-5 py-3.5 sm:grid-cols-[2rem_1.4fr_9rem_1fr_6.5rem] sm:px-6 ${bad ? 'bg-accent/[.07]' : ''}`}>
              <span className="font-mono text-xs text-cream/75">#{i + 1}</span>
              <span className="text-sm">{r.memo}</span>
              <label className="flex items-center justify-end gap-1 sm:justify-start">
                <span className="text-cream/75">₦</span>
                <input
                  type="number" inputMode="numeric" value={amount}
                  onChange={(e) => { const v = Number(e.target.value); setEdits((p) => (Number.isFinite(v) && v !== r.kobo / 100 ? { ...p, [i]: v } : (({ [i]: _drop, ...rest }) => rest)(p))); }}
                  aria-label={`Amount for entry ${i + 1} in naira`}
                  className="w-28 rounded-md border border-white/[.22] bg-ink/60 px-2 py-1.5 font-mono text-sm focus:border-accent focus:outline-none"
                />
              </label>
              <span className="col-span-2 font-mono text-[11px] text-cream/75 sm:col-span-1">seal {short(r.hash)}</span>
              <span className={`justify-self-end font-mono text-[11px] uppercase tracking-wider ${bad ? 'text-accent' : 'text-teal'}`}>{bad ? 'changed' : 'sealed'}</span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/[.14] px-5 py-4 sm:px-6">
        <button onClick={reset} className="btn btn-ghost !px-4 !py-2 text-xs" disabled={!edited && chainOk && fingerprintMatches}>Restore</button>
        <button onClick={forge} className="btn btn-ghost !px-4 !py-2 text-xs" disabled={!edited}>Try to cover it up (recompute the hashes)</button>
        <p className="w-full text-xs text-cream/75 sm:w-auto sm:flex-1 sm:text-right">
          Edit any amount. Covering it up repairs the chain but changes the fingerprint, so it only gets caught if the owner wrote the old one down. Tamper-evident, not tamper-proof.
        </p>
      </div>
    </div>
  );
}
