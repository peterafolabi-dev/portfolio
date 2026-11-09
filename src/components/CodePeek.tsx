import { useId, useState } from 'react';
import { highlight, type Lang } from '../lib/highlight';

export interface PeekData { title: string; file: string; lang: Lang; why: string; code: string; url: string; proof: string; proofUrl?: string }

/** "View code" toggle for a project card: real lines of logic, syntax-coloured, copyable, with a link to the exact commit. */
export default function CodePeek({ peek }: { peek: PeekData }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const id = useId();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(peek.code);
    } catch {
      const t = document.createElement('textarea');
      t.value = peek.code; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-3" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group/peek flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left font-mono text-[11px] uppercase tracking-[.14em] text-teal transition hover:text-white"
      >
        <span className="flex items-center gap-2"><span aria-hidden="true" className="text-accent">{'</>'}</span>{open ? 'Hide code' : 'View code'}</span>
        <span aria-hidden="true" className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>›</span>
      </button>

      <div id={id} className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden" {...(open ? {} : { inert: true as unknown as undefined })}>
          <p className="pb-3 pt-2 text-[13px] leading-snug text-cream/94">{peek.why}</p>
          <div className="overflow-hidden rounded-xl border border-white/[.14] bg-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 font-mono text-[10.5px] text-cream/90">
              <span className="truncate">{peek.file}</span>
              <button type="button" onClick={copy} aria-live="polite" className="shrink-0 rounded-md border border-white/15 px-2 py-1 text-cream/90 transition hover:border-accent hover:text-white">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <pre tabIndex={0} className="no-scrollbar max-h-72 overflow-auto p-3.5 font-mono text-[11.5px] leading-relaxed text-cream"><code dangerouslySetInnerHTML={{ __html: highlight(peek.code, peek.lang) }} /></pre>
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-1 pt-3 text-[11.5px] leading-snug text-cream/90">
            <span className="font-mono uppercase tracking-widest text-teal">Proof</span>
            <span>{peek.proof}</span>
          </p>
          <p className="flex gap-4 pb-2 pt-1 font-mono text-[11px]">
            <a href={peek.url} target="_blank" rel="noopener" className="text-accent hover:underline">Exact lines on GitHub ↗</a>
            {peek.proofUrl && <a href={peek.proofUrl} target="_blank" rel="noopener" className="text-accent hover:underline">The test ↗</a>}
          </p>
        </div>
      </div>
    </div>
  );
}
