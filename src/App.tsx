import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { Battlefield } from './components/Battlefield';
import { UnitPanel } from './components/UnitPanel';
import { UpgradePanel } from './components/UpgradePanel';
import './App.css';

function App() {
  const {
    state,
    saveData,
    startGame,
    startWave,
    summonUnit,
    upgradeUnit,
    nextWave,
    togglePause,
    resetGame,
    allyUnits,
  } = useGame();

  const [showUpgrade, setShowUpgrade] = useState(false);

  // タイトル画面
  if (!state.isPlaying) {
    return (
      <div className="app">
        <div className="title-screen">
          <h1>🐱 キジトラ大戦争 🐱</h1>
          <p className="subtitle">〜猫神を倒せ！〜</p>
          
          <div className="title-stats">
            <p>所持猫魂: 👻 {saveData.souls}</p>
            <p>最高到達ウェーブ: 🏆 {saveData.highestWave}</p>
          </div>
          
          <div className="title-buttons">
            <button className="start-btn" onClick={startGame}>
              ゲーム開始
            </button>
            <button className="upgrade-btn-title" onClick={() => setShowUpgrade(true)}>
              ユニット強化
            </button>
          </div>

          <div className="instructions">
            <h3>遊び方</h3>
            <ul>
              <li>💰 お金を貯めてキジトラを召喚</li>
              <li>⚔️ 敵を倒してお金と猫魂をGET</li>
              <li>🏠 敵拠点を破壊すれば勝利！</li>
              <li>👻 猫魂でユニットを強化しよう</li>
            </ul>
          </div>
        </div>

        {showUpgrade && (
          <UpgradePanel
            units={allyUnits}
            saveData={saveData}
            onUpgrade={upgradeUnit}
            onClose={() => setShowUpgrade(false)}
          />
        )}
      </div>
    );
  }

  // 勝利画面
  if (state.isVictory) {
    return (
      <div className="app">
        <div className="result-screen victory">
          <h1>🎉 勝利！ 🎉</h1>
          <p>Wave {state.currentWave} クリア！</p>
          <p>獲得猫魂: 👻 {state.souls}</p>
          
          {state.currentWave < state.maxWave ? (
            <div className="result-buttons">
              <button onClick={nextWave}>次のウェーブへ</button>
              <button onClick={resetGame}>タイトルに戻る</button>
            </div>
          ) : (
            <div className="result-buttons">
              <h2>🏆 全ウェーブクリア！ 🏆</h2>
              <p>おめでとう！あなたは真のキジトラマスターだ！</p>
              <button onClick={resetGame}>タイトルに戻る</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 敗北画面
  if (state.isDefeat) {
    return (
      <div className="app">
        <div className="result-screen defeat">
          <h1>💀 敗北... 💀</h1>
          <p>Wave {state.currentWave} で敗退</p>
          <p>獲得猫魂: 👻 {state.souls}</p>
          <button onClick={resetGame}>タイトルに戻る</button>
        </div>
      </div>
    );
  }

  // ゲーム画面
  return (
    <div className="app">
      <header className="game-header">
        <div className="header-left">
          <span className="money">💰 {state.money}円</span>
          <span className="souls">👻 {state.souls}</span>
        </div>
        <div className="header-center">
          <span className="wave">Wave {state.currentWave} / {state.maxWave}</span>
        </div>
        <div className="header-right">
          <span className="base-hp">🏠 HP: {state.playerBaseHp}/{state.playerBaseMaxHp}</span>
          <button className="pause-btn" onClick={togglePause}>
            {state.isPaused ? '▶️' : '⏸️'}
          </button>
        </div>
      </header>

      <main className="game-main">
        <Battlefield
          units={state.units}
          playerBaseHp={state.playerBaseHp}
          playerBaseMaxHp={state.playerBaseMaxHp}
          enemyBaseHp={state.enemyBaseHp}
          enemyBaseMaxHp={state.enemyBaseMaxHp}
        />

        {state.isPaused && (
          <div className="pause-overlay">
            <h2>⏸️ 一時停止 ⏸️</h2>
            <button onClick={togglePause}>再開</button>
            <button onClick={resetGame}>タイトルに戻る</button>
          </div>
        )}

        {!state.waveInProgress && !state.isPaused && (
          <div className="wave-start">
            <button className="wave-start-btn" onClick={startWave}>
              🚀 Wave {state.currentWave} 開始！
            </button>
          </div>
        )}
      </main>

      <footer className="game-footer">
        <UnitPanel
          units={allyUnits}
          money={state.money}
          saveData={saveData}
          onSummon={summonUnit}
          disabled={state.isPaused || !state.waveInProgress}
        />
      </footer>
    </div>
  );
}

export default App;
