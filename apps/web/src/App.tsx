import { useState } from 'react';
import { createMockGameState } from '@restaurateur/game-engine';
import { LEVEL_1 } from './data/level1';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { LevelFailedScreen } from './screens/LevelFailedScreen';

type Screen = 'home' | 'game' | 'complete' | 'failed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState(1);
  const mockState = createMockGameState(LEVEL_1);

  if (screen === 'home') {
    return (
      <HomeScreen
        level={currentLevel}
        onStart={() => setScreen('game')}
      />
    );
  }

  if (screen === 'game') {
    return (
      <GameScreen
        state={mockState}
        onWin={() => setScreen('complete')}
        onLose={() => setScreen('failed')}
        onHome={() => setScreen('home')}
      />
    );
  }

  if (screen === 'complete') {
    return (
      <LevelCompleteScreen
        pantry={mockState.pantry}
        onNext={() => {
          setCurrentLevel((level) => level + 1);
          setScreen('home');
        }}
        onReplay={() => setScreen('game')}
      />
    );
  }

  return (
    <LevelFailedScreen
      onRetry={() => setScreen('game')}
      onHome={() => setScreen('home')}
    />
  );
}
