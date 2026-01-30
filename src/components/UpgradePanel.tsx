import React from 'react';
import type { UnitStats, SaveData } from '../types/game';
import { LEVEL_UP_COSTS, getUpgradedStats } from '../data/units';

interface UpgradePanelProps {
  units: UnitStats[];
  saveData: SaveData;
  onUpgrade: (unitId: string) => void;
  onClose: () => void;
}

export const UpgradePanel: React.FC<UpgradePanelProps> = ({
  units,
  saveData,
  onUpgrade,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="upgrade-panel">
        <h2>🐱 ユニット強化 🐱</h2>
        <p className="souls-display">所持猫魂: 👻 {saveData.souls}</p>
        
        <div className="upgrade-list">
          {units.map(baseUnit => {
            const level = saveData.unitLevels[baseUnit.id] || 1;
            const unit = getUpgradedStats(baseUnit, level);
            const nextCost = level < 5 ? LEVEL_UP_COSTS[level] : null;
            const canUpgrade = nextCost !== null && saveData.souls >= nextCost;
            
            return (
              <div key={unit.id} className="upgrade-item">
                <div className="upgrade-info">
                  <span className="unit-emoji">{unit.emoji}</span>
                  <span className="unit-name">{unit.name}</span>
                  <span className="unit-stats">
                    HP: {unit.hp} | ATK: {unit.attack}
                  </span>
                </div>
                <div className="upgrade-action">
                  <span className="level-badge">Lv.{level}</span>
                  {nextCost !== null ? (
                    <button
                      className={`upgrade-btn ${canUpgrade ? '' : 'disabled'}`}
                      onClick={() => onUpgrade(unit.id)}
                      disabled={!canUpgrade}
                    >
                      強化 👻{nextCost}
                    </button>
                  ) : (
                    <span className="max-level">MAX</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="close-btn" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};
