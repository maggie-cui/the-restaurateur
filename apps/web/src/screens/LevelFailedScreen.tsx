type LevelFailedScreenProps = {
  onRetry: () => void;
  onHome: () => void;
};

export function LevelFailedScreen({ onRetry, onHome }: LevelFailedScreenProps) {
  return (
    <main className="screen">
      <h1>Order incomplete!</h1>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
      <button type="button" onClick={onHome}>
        Home
      </button>
    </main>
  );
}
