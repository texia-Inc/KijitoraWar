import React from 'react';
import type { UnitStats, SaveData } from '../types/game';
import { getUpgradedStats } from '../data/units';

interface UnitPanelProps {
  units: UnitStats[];
  money: number;
  saveData: SaveData;
  onSummon: (unitId: string) => void;
  disabled: boolean;
}

export const UnitPanel: React.FC<UnitPanelProps> = ({
  units,
  money,
  saveData,
  onSummon,
  disabled,
}) => {
  return (
    <div className="unit-panel">
      {units.map(baseUnit => {
        const level = saveData.unitLevels[baseUnit.id] || 1;
        const unit = getUpgradedStats(baseUnit, level);
        const canAfford = money >= unit.cost;
        
        return (
          <button
            key={unit.id}
            className={`unit-btn ${canAfford ? '' : 'disabled'}`}
            onClick={() => onSummon(unit.id)}
            disabled={disabled || !canAfford}
            title={`${unit.name} - HP:${unit.hp} ATK:${unit.attack}`}
          >
            <span className="unit-emoji">{unit.emoji}</span>
            <span className="unit-name">{unit.name}</span>
            <span className="unit-cost">💰{unit.cost}</span>
            {level > 1 && <span className="unit-level">Lv.{level}</span>}
          </button>
        );
      })}
    </div>
  );
};
