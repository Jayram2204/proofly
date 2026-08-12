interface GlitchTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function GlitchText({
  text,
  tag = 'h1',
  className = '',
}: GlitchTextProps) {
  const Tag = tag;
  return (
    <Tag className={`glitch ${className}`} data-text={text}>
      {text}
    </Tag>
  );
}
