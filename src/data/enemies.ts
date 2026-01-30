import type { EnemyTemplate, Wave } from '../types/game';

// 敵ユニット（猫神軍）6種類
export const ENEMY_TEMPLATES: EnemyTemplate[] = [
  {
    id: 'koneko',
    name: '子猫神',
    emoji: '👼',
    hp: 30,
    attack: 8,
    speed: 2,
    range: 30,
    attackCooldown: 35,
    soulReward: 2,
    moneyReward: 15,
  },
  {
    id: 'heishi',
    name: '猫神兵',
    emoji: '⚔️',
    hp: 80,
    attack: 20,
    speed: 1.5,
    range: 30,
    attackCooldown: 40,
    soulReward: 5,
    moneyReward: 40,
  },
  {
    id: 'kishi',
    name: '猫神騎士',
    emoji: '🛡️',
    hp: 200,
    attack: 30,
    speed: 1,
    range: 30,
    attackCooldown: 50,
    soulReward: 15,
    moneyReward: 100,
  },
  {
    id: 'jutsushi',
    name: '猫神術師',
    emoji: '🔮',
    hp: 50,
    attack: 45,
    speed: 1,
    range: 120,
    attackCooldown: 60,
    soulReward: 10,
    moneyReward: 75,
    special: 'ranged',
  },
  {
    id: 'shogun',
    name: '猫神将軍',
    emoji: '👺',
    hp: 500,
    attack: 60,
    speed: 1,
    range: 35,
    attackCooldown: 45,
    soulReward: 50,
    moneyReward: 250,
  },
  {
    id: 'daineko',
    name: '大猫神',
    emoji: '🐲',
    hp: 1500,
    attack: 100,
    speed: 0.5,
    range: 40,
    attackCooldown: 40,
    soulReward: 200,
    moneyReward: 500,
  },
];

// 全10ウェーブの定義
export const WAVES: Wave[] = [
  // Wave 1: チュートリアル的
  {
    waveNumber: 1,
    enemies: [
      { templateId: 'koneko', count: 5, delay: 60 },
    ],
  },
  // Wave 2
  {
    waveNumber: 2,
    enemies: [
      { templateId: 'koneko', count: 8, delay: 50 },
      { templateId: 'heishi', count: 2, delay: 90 },
    ],
  },
  // Wave 3
  {
    waveNumber: 3,
    enemies: [
      { templateId: 'koneko', count: 10, delay: 40 },
      { templateId: 'heishi', count: 4, delay: 80 },
    ],
  },
  // Wave 4
  {
    waveNumber: 4,
    enemies: [
      { templateId: 'heishi', count: 8, delay: 60 },
      { templateId: 'koneko', count: 15, delay: 30 },
    ],
  },
  // Wave 5: 中ボス登場
  {
    waveNumber: 5,
    enemies: [
      { templateId: 'heishi', count: 5, delay: 70 },
      { templateId: 'shogun', count: 1, delay: 0 },
      { templateId: 'koneko', count: 10, delay: 40 },
    ],
  },
  // Wave 6: 騎士登場
  {
    waveNumber: 6,
    enemies: [
      { templateId: 'kishi', count: 3, delay: 100 },
      { templateId: 'heishi', count: 6, delay: 60 },
      { templateId: 'koneko', count: 12, delay: 35 },
    ],
  },
  // Wave 7: 術師登場
  {
    waveNumber: 7,
    enemies: [
      { templateId: 'jutsushi', count: 3, delay: 90 },
      { templateId: 'kishi', count: 4, delay: 90 },
      { templateId: 'heishi', count: 8, delay: 50 },
    ],
  },
  // Wave 8
  {
    waveNumber: 8,
    enemies: [
      { templateId: 'jutsushi', count: 5, delay: 70 },
      { templateId: 'kishi', count: 5, delay: 80 },
      { templateId: 'heishi', count: 10, delay: 40 },
    ],
  },
  // Wave 9: 総力戦
  {
    waveNumber: 9,
    enemies: [
      { templateId: 'shogun', count: 2, delay: 200 },
      { templateId: 'jutsushi', count: 6, delay: 60 },
      { templateId: 'kishi', count: 6, delay: 70 },
      { templateId: 'heishi', count: 12, delay: 35 },
    ],
  },
  // Wave 10: 最終決戦
  {
    waveNumber: 10,
    enemies: [
      { templateId: 'daineko', count: 1, delay: 0 },
      { templateId: 'shogun', count: 2, delay: 150 },
      { templateId: 'jutsushi', count: 4, delay: 80 },
      { templateId: 'kishi', count: 5, delay: 80 },
      { templateId: 'heishi', count: 8, delay: 50 },
    ],
  },
];

export function getEnemyTemplate(id: string): EnemyTemplate | undefined {
  return ENEMY_TEMPLATES.find(e => e.id === id);
}
