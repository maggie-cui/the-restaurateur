type HomeScreenProps = {
  level: number;
  onStart: () => void;
};

export function HomeScreen({ level, onStart }: HomeScreenProps) {
  return (
    <main className="screen">
      <h1>The Restaurateur</h1>
      <p className="level-label">Level {level}</p>
      <button type="button" onClick={onStart}>
        Start Cooking
      </button>
    </main>
  );
}
