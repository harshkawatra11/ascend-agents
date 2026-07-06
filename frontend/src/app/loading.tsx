export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-paper text-ink">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-hairline border-t-accent-clay animate-spin mb-4"></div>
        <p className="font-serif-display text-lg text-ink-soft">Loading Operations Center...</p>
      </div>
    </div>
  );
}
