export function Section({
  title,
  eyebrow,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-hairline pt-8 ${className}`}>
      <div className="mb-5">
        {eyebrow && (
          <p className="text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif-display text-2xl text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}
