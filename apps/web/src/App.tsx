import { useState } from 'react';
import { createGame } from '@restaurateur/game-engine';
import type { GameState } from '@restaurateur/game-engine';
import { LEVEL_1 } from './data/level1';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { LevelFailedScreen } from './screens/LevelFailedScreen';

type Screen = 'home' | 'game' | 'complete' | 'failed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>(() => createGame(LEVEL_1));

  const startLevel = () => {
    setGameState(createGame(LEVEL_1));
    setScreen('game');
  };

  if (screen === 'home') {
    return (
      <HomeScreen
        level={currentLevel}
        onStart={startLevel}
      />
    );
  }

  if (screen === 'game') {
    return (
      <GameScreen
        state={gameState}
        onStateChange={setGameState}
        onWin={() => setScreen('complete')}
        onLose={() => setScreen('failed')}
        onHome={() => setScreen('home')}
      />
    );
  }

  if (screen === 'complete') {
    return (
      <LevelCompleteScreen
        state={gameState}
        onNext={() => {
          setCurrentLevel((level) => level + 1);
          setScreen('home');
        }}
        onReplay={startLevel}
      />
    );
  }

  return (
    <LevelFailedScreen
      state={gameState}
      onRetry={startLevel}
      onHome={() => setScreen('home')}
    />
  );
}
