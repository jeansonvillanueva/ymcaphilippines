type Props = {
  text: string;
  accent?: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

function splitAccent(text: string, accent: string) {
  const idx = text.lastIndexOf(accent);
  if (idx < 0) return { before: text, accent: '', after: '' };
  return {
    before: text.slice(0, idx),
    accent: text.slice(idx, idx + accent.length),
    after: text.slice(idx + accent.length),
  };
}

export default function SubjectHeader({ text, accent = 'Y', as = 'h2', className }: Props) {
  const Tag = as;
  const parts = splitAccent(text, accent);

  return (
    <div className={`subject-header ${className ?? ''}`.trim()}>
      <Tag className="subject-header__title">
        {parts.before}
        {parts.accent ? <span className="subject-header__accent">{parts.accent}</span> : null}
        {parts.after}
      </Tag>
      <div className="subject-header__line" aria-hidden />
    </div>
  );
}

