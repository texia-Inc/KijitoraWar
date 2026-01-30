import type { SaveData } from '../types/game';

const STORAGE_KEY = 'kijitora-war-save';

const DEFAULT_SAVE: SaveData = {
  souls: 0,
  unitLevels: {},
  highestWave: 0,
};

export function loadSave(): SaveData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_SAVE, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load save:', e);
  }
  return { ...DEFAULT_SAVE };
}

export function saveSave(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save:', e);
  }
}

export function resetSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}
