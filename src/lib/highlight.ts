export type Lang = 'ts' | 'sql' | 'py';

const KEYWORDS: Record<Lang, string> = {
  ts: 'export|async|function|const|let|for|if|else|return|try|catch|await|new|type|interface|from|import|it|expect|throw',
  sql: 'constraint|exclude|using|gist|with|where|in|and|or|not|create|table|alter|add|check|primary|key|references|on|delete|cascade|default|null|select|from|insert|into|update|set',
  py: 'def|class|if|elif|else|return|import|from|for|in|not|and|or|try|except|with|as|is|None|True|False|raise|pass',
};
const COMMENT: Record<Lang, string> = { ts: '\\/\\/.*$', sql: '--.*$', py: '#.*$' };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tiny single-pass highlighter (comments, strings, keywords, numbers). Returns safe HTML with Tailwind colour classes. */
export function highlight(code: string, lang: Lang): string {
  const re = new RegExp(
    `(${COMMENT[lang]})|('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\`)|\\b(${KEYWORDS[lang]})\\b|(\\b\\d[\\d_.]*\\b)`,
    lang === 'sql' ? 'gim' : 'gm',
  );
  return code
    .split('\n')
    .map((line) => {
      let out = '';
      let last = 0;
      let m: RegExpExecArray | null;
      re.lastIndex = 0;
      while ((m = re.exec(line))) {
        out += esc(line.slice(last, m.index));
        const cls = m[1] ? 'text-cream/55 italic' : m[2] ? 'text-teal' : m[3] ? 'text-accent' : 'text-amber';
        out += `<span class="${cls}">${esc(m[0])}</span>`;
        last = m.index + m[0].length;
        if (m[0].length === 0) re.lastIndex++;
      }
      return out + esc(line.slice(last));
    })
    .join('\n');
}
