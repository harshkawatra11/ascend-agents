export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1">
          {eyebrow}
        </p>
        <h1 className="font-serif-display text-3xl text-ink">{title}</h1>
      </div>
      {action}
    </div>
  );
}
