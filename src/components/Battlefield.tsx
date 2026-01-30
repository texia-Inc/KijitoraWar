import React from 'react';
import type { Unit } from '../types/game';
import { PLAYER_BASE_X, ENEMY_BASE_X, FIELD_WIDTH, FIELD_HEIGHT } from '../types/game';
import { ALLY_UNITS } from '../data/units';
import { ENEMY_TEMPLATES } from '../data/enemies';

interface BattlefieldProps {
  units: Unit[];
  playerBaseHp: number;
  playerBaseMaxHp: number;
  enemyBaseHp: number;
  enemyBaseMaxHp: number;
}

function getUnitEmoji(unit: Unit): string {
  if (unit.isEnemy) {
    const template = ENEMY_TEMPLATES.find(e => e.id === unit.statsId);
    return template?.emoji || '👿';
  } else {
    const stats = ALLY_UNITS.find(u => u.id === unit.statsId);
    return stats?.emoji || '🐱';
  }
}

export const Battlefield: React.FC<BattlefieldProps> = ({
  units,
  playerBaseHp,
  playerBaseMaxHp,
  enemyBaseHp,
  enemyBaseMaxHp,
}) => {
  return (
    <div className="battlefield">
      <svg width={FIELD_WIDTH} height={FIELD_HEIGHT} viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}>
        {/* 背景 */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#E0F6FF" />
          </linearGradient>
        </defs>
        <rect width={FIELD_WIDTH} height={FIELD_HEIGHT} fill="url(#skyGradient)" />
        
        {/* 地面 */}
        <rect x="0" y={FIELD_HEIGHT - 60} width={FIELD_WIDTH} height="60" fill="#8B4513" />
        <rect x="0" y={FIELD_HEIGHT - 60} width={FIELD_WIDTH} height="10" fill="#228B22" />

        {/* プレイヤー拠点 */}
        <g transform={`translate(${PLAYER_BASE_X}, ${FIELD_HEIGHT - 120})`}>
          <rect x="-30" y="0" width="60" height="60" fill="#CD853F" stroke="#8B4513" strokeWidth="3" />
          <polygon points="-35,0 0,-30 35,0" fill="#DC143C" />
          <text x="0" y="40" textAnchor="middle" fontSize="24">🏠</text>
        </g>
        
        {/* HP Bar - Player */}
        <g transform={`translate(${PLAYER_BASE_X}, ${FIELD_HEIGHT - 140})`}>
          <rect x="-30" y="0" width="60" height="8" fill="#444" rx="2" />
          <rect 
            x="-30" y="0" 
            width={Math.max(0, (playerBaseHp / playerBaseMaxHp) * 60)} 
            height="8" 
            fill="#4CAF50" 
            rx="2" 
          />
        </g>

        {/* 敵拠点 */}
        <g transform={`translate(${ENEMY_BASE_X}, ${FIELD_HEIGHT - 130})`}>
          <polygon points="-40,70 0,-20 40,70" fill="#4A0080" stroke="#2A0050" strokeWidth="3" />
          <circle cx="0" cy="10" r="15" fill="#FFD700" />
          <text x="0" y="50" textAnchor="middle" fontSize="28">⛩️</text>
        </g>
        
        {/* HP Bar - Enemy */}
        <g transform={`translate(${ENEMY_BASE_X}, ${FIELD_HEIGHT - 150})`}>
          <rect x="-30" y="0" width="60" height="8" fill="#444" rx="2" />
          <rect 
            x="-30" y="0" 
            width={Math.max(0, (enemyBaseHp / enemyBaseMaxHp) * 60)} 
            height="8" 
            fill="#F44336" 
            rx="2" 
          />
        </g>

        {/* ユニット */}
        {units.map(unit => {
          const emoji = getUnitEmoji(unit);
          const y = FIELD_HEIGHT - 80;
          const hpPercent = unit.hp / unit.maxHp;
          
          return (
            <g key={unit.id} transform={`translate(${unit.x}, ${y})`}>
              {/* HP Bar */}
              <rect x="-15" y="-25" width="30" height="4" fill="#444" rx="1" />
              <rect 
                x="-15" y="-25" 
                width={30 * hpPercent} 
                height="4" 
                fill={unit.isEnemy ? '#F44336' : '#4CAF50'} 
                rx="1" 
              />
              
              {/* Unit */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="28"
                style={{ 
                  transform: unit.isEnemy ? 'scaleX(-1)' : undefined,
                  filter: unit.special === 'shield' ? 'drop-shadow(0 0 5px #00BFFF)' : undefined,
                }}
              >
                {emoji}
              </text>
              
              {/* Special indicators */}
              {unit.special === 'healer' && (
                <text x="0" y="-35" textAnchor="middle" fontSize="12">💚</text>
              )}
              {unit.special === 'aoe' && (
                <text x="0" y="-35" textAnchor="middle" fontSize="12">💥</text>
              )}
              {unit.special === 'ranged' && (
                <text x="0" y="-35" textAnchor="middle" fontSize="12">🎯</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
