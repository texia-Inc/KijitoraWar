import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, Unit, SaveData } from '../types/game';
import { PLAYER_BASE_X, ENEMY_BASE_X } from '../types/game';
import { ALLY_UNITS, getUpgradedStats, LEVEL_UP_COSTS } from '../data/units';
import { WAVES, getEnemyTemplate } from '../data/enemies';
import { loadSave, saveSave } from '../utils/storage';

let unitIdCounter = 0;
const generateUnitId = () => `unit-${unitIdCounter++}`;

const INITIAL_STATE: GameState = {
  money: 500,
  souls: 0,
  currentWave: 1,
  maxWave: 10,
  playerBaseHp: 1000,
  playerBaseMaxHp: 1000,
  enemyBaseHp: 1000,
  enemyBaseMaxHp: 1000,
  units: [],
  isPlaying: false,
  isPaused: false,
  isVictory: false,
  isDefeat: false,
  waveInProgress: false,
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [saveData, setSaveData] = useState<SaveData>(() => loadSave());
  const gameLoopRef = useRef<number | null>(null);
  const enemySpawnRef = useRef<{ queue: { templateId: string; delay: number }[]; frameCounter: number }>({
    queue: [],
    frameCounter: 0,
  });

  // ゲーム開始
  const startGame = useCallback(() => {
    unitIdCounter = 0;
    setState({
      ...INITIAL_STATE,
      souls: saveData.souls,
      isPlaying: true,
    });
    enemySpawnRef.current = { queue: [], frameCounter: 0 };
  }, [saveData.souls]);

  // ウェーブ開始
  const startWave = useCallback(() => {
    const wave = WAVES[state.currentWave - 1];
    if (!wave) return;

    const queue: { templateId: string; delay: number }[] = [];
    let currentDelay = 60; // 1秒後に最初の敵

    wave.enemies.forEach(({ templateId, count, delay }) => {
      for (let i = 0; i < count; i++) {
        queue.push({ templateId, delay: currentDelay });
        currentDelay += delay;
      }
    });

    enemySpawnRef.current = { queue, frameCounter: 0 };
    setState(s => ({ ...s, waveInProgress: true }));
  }, [state.currentWave]);

  // ユニット召喚
  const summonUnit = useCallback((unitId: string) => {
    const baseStats = ALLY_UNITS.find(u => u.id === unitId);
    if (!baseStats) return;

    const level = saveData.unitLevels[unitId] || 1;
    const stats = getUpgradedStats(baseStats, level);

    if (state.money < stats.cost) return;

    const unit: Unit = {
      id: generateUnitId(),
      statsId: unitId,
      x: PLAYER_BASE_X + 30,
      hp: stats.hp,
      maxHp: stats.hp,
      attack: stats.attack,
      speed: stats.speed,
      range: stats.range,
      attackCooldown: stats.attackCooldown,
      currentCooldown: 0,
      isEnemy: false,
      special: stats.special,
    };

    setState(s => ({
      ...s,
      money: s.money - stats.cost,
      units: [...s.units, unit],
    }));
  }, [state.money, saveData.unitLevels]);

  // レベルアップ
  const upgradeUnit = useCallback((unitId: string) => {
    const currentLevel = saveData.unitLevels[unitId] || 1;
    if (currentLevel >= 5) return;

    const cost = LEVEL_UP_COSTS[currentLevel];
    if (saveData.souls < cost) return;

    const newSaveData = {
      ...saveData,
      souls: saveData.souls - cost,
      unitLevels: {
        ...saveData.unitLevels,
        [unitId]: currentLevel + 1,
      },
    };

    setSaveData(newSaveData);
    saveSave(newSaveData);
  }, [saveData]);

  // ゲームループ
  useEffect(() => {
    if (!state.isPlaying || state.isPaused || state.isVictory || state.isDefeat) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const gameLoop = () => {
      setState(prevState => {
        let { money, souls, units, playerBaseHp, enemyBaseHp, waveInProgress, currentWave } = prevState;

        // 資源自動増加 (10円/秒 = 約0.17円/フレーム)
        money += 0.17;

        // 敵のスポーン処理
        const spawn = enemySpawnRef.current;
        spawn.frameCounter++;
        const toSpawn = spawn.queue.filter(e => e.delay <= spawn.frameCounter);
        spawn.queue = spawn.queue.filter(e => e.delay > spawn.frameCounter);
        toSpawn.forEach(e => {
          const template = getEnemyTemplate(e.templateId);
          if (template) {
            const waveMultiplier = 1 + (currentWave - 1) * 0.1;
            units = [...units, {
              id: generateUnitId(),
              statsId: e.templateId,
              x: ENEMY_BASE_X - 30,
              hp: Math.floor(template.hp * waveMultiplier),
              maxHp: Math.floor(template.hp * waveMultiplier),
              attack: Math.floor(template.attack * waveMultiplier),
              speed: template.speed,
              range: template.range,
              attackCooldown: template.attackCooldown,
              currentCooldown: 0,
              isEnemy: true,
              special: template.special,
            }];
          }
        });

        // ユニットの移動と戦闘
        const allyUnits = units.filter(u => !u.isEnemy);
        const enemyUnits = units.filter(u => u.isEnemy);

        units = units.map(unit => {
          let { x, currentCooldown, hp } = unit;
          currentCooldown = Math.max(0, currentCooldown - 1);

          const targets = unit.isEnemy ? allyUnits : enemyUnits;
          const nearestTarget = targets
            .filter(t => t.hp > 0)
            .sort((a, b) => {
              const distA = Math.abs(a.x - unit.x);
              const distB = Math.abs(b.x - unit.x);
              return distA - distB;
            })[0];

          // ヒーラーの特殊処理
          if (unit.special === 'healer' && !unit.isEnemy) {
            const allies = allyUnits.filter(a => a.hp > 0 && a.hp < a.maxHp && a.id !== unit.id);
            const nearestAlly = allies.sort((a, b) => Math.abs(a.x - unit.x) - Math.abs(b.x - unit.x))[0];
            if (nearestAlly && Math.abs(nearestAlly.x - unit.x) <= unit.range) {
              if (currentCooldown === 0) {
                nearestAlly.hp = Math.min(nearestAlly.maxHp, nearestAlly.hp + unit.attack);
                currentCooldown = unit.attackCooldown;
              }
            }
          }

          const distanceToTarget = nearestTarget ? Math.abs(nearestTarget.x - x) : Infinity;
          const distanceToBase = unit.isEnemy 
            ? x - PLAYER_BASE_X
            : ENEMY_BASE_X - x;

          // 攻撃範囲内に敵がいるか、拠点に到達
          const inAttackRange = distanceToTarget <= unit.range;
          const atEnemyBase = distanceToBase <= unit.range;

          if (inAttackRange && nearestTarget && unit.special !== 'healer') {
            // 攻撃
            if (currentCooldown === 0) {
              if (unit.special === 'aoe') {
                // 範囲攻撃
                targets.forEach(t => {
                  if (Math.abs(t.x - nearestTarget.x) <= 50) {
                    t.hp -= unit.attack;
                  }
                });
              } else {
                nearestTarget.hp -= unit.attack;
              }
              currentCooldown = unit.attackCooldown;
            }
          } else if (atEnemyBase) {
            // 拠点攻撃
            if (currentCooldown === 0) {
              if (unit.isEnemy) {
                playerBaseHp -= unit.attack;
              } else {
                enemyBaseHp -= unit.attack;
              }
              currentCooldown = unit.attackCooldown;
            }
          } else if (!inAttackRange && unit.special !== 'healer') {
            // 移動
            x += unit.isEnemy ? -unit.speed : unit.speed;
          }

          return { ...unit, x, currentCooldown, hp };
        });

        // 死亡ユニットの処理
        const deadEnemies = units.filter(u => u.isEnemy && u.hp <= 0);
        deadEnemies.forEach(u => {
          const template = getEnemyTemplate(u.statsId);
          if (template) {
            money += template.moneyReward;
            souls += template.soulReward;
          }
        });

        units = units.filter(u => u.hp > 0);

        // ウェーブ終了チェック
        const enemiesRemaining = units.filter(u => u.isEnemy).length;
        const spawnQueueEmpty = enemySpawnRef.current.queue.length === 0;
        
        if (waveInProgress && enemiesRemaining === 0 && spawnQueueEmpty) {
          waveInProgress = false;
        }

        // 勝敗判定
        const isVictory = enemyBaseHp <= 0;
        const isDefeat = playerBaseHp <= 0;

        if (isVictory || isDefeat) {
          const newSaveData = {
            ...saveData,
            souls: saveData.souls + Math.floor(souls),
            highestWave: Math.max(saveData.highestWave, currentWave),
          };
          setSaveData(newSaveData);
          saveSave(newSaveData);
        }

        return {
          ...prevState,
          money: Math.floor(money),
          souls: Math.floor(souls),
          units,
          playerBaseHp: Math.max(0, playerBaseHp),
          enemyBaseHp: Math.max(0, enemyBaseHp),
          waveInProgress,
          isVictory,
          isDefeat,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [state.isPlaying, state.isPaused, state.isVictory, state.isDefeat, saveData]);

  // 次のウェーブへ
  const nextWave = useCallback(() => {
    if (state.currentWave < state.maxWave) {
      setState(s => ({
        ...s,
        currentWave: s.currentWave + 1,
        enemyBaseHp: s.enemyBaseMaxHp,
      }));
    }
  }, [state.currentWave, state.maxWave]);

  // ポーズ切り替え
  const togglePause = useCallback(() => {
    setState(s => ({ ...s, isPaused: !s.isPaused }));
  }, []);

  // リセット
  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
    enemySpawnRef.current = { queue: [], frameCounter: 0 };
  }, []);

  return {
    state,
    saveData,
    startGame,
    startWave,
    summonUnit,
    upgradeUnit,
    nextWave,
    togglePause,
    resetGame,
    allyUnits: ALLY_UNITS,
  };
}
