// ゲームの型定義

export type UnitSpecial = 'healer' | 'aoe' | 'shield' | 'ranged';

export interface UnitStats {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  hp: number;
  attack: number;
  speed: number; // pixels per frame
  range: number; // attack range in pixels
  attackCooldown: number; // frames between attacks
  special?: 'healer' | 'aoe' | 'shield' | 'ranged';
  unlocked: boolean;
  level: number;
}

export interface Unit {
  id: string;
  statsId: string;
  x: number;
  hp: number;
  maxHp: number;
  attack: number;
  speed: number;
  range: number;
  attackCooldown: number;
  currentCooldown: number;
  isEnemy: boolean;
  special?: 'healer' | 'aoe' | 'shield' | 'ranged';
}

export interface EnemyTemplate {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  attack: number;
  speed: number;
  range: number;
  attackCooldown: number;
  soulReward: number;
  moneyReward: number;
  special?: 'ranged';
}

export interface Wave {
  waveNumber: number;
  enemies: { templateId: string; count: number; delay: number }[];
}

export interface GameState {
  money: number;
  souls: number;
  currentWave: number;
  maxWave: number;
  playerBaseHp: number;
  playerBaseMaxHp: number;
  enemyBaseHp: number;
  enemyBaseMaxHp: number;
  units: Unit[];
  isPlaying: boolean;
  isPaused: boolean;
  isVictory: boolean;
  isDefeat: boolean;
  waveInProgress: boolean;
}

export interface SaveData {
  souls: number;
  unitLevels: Record<string, number>;
  highestWave: number;
}

export const FIELD_WIDTH = 800;
export const FIELD_HEIGHT = 300;
export const PLAYER_BASE_X = 50;
export const ENEMY_BASE_X = 750;
