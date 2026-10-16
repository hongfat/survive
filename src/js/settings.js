import { readJson, writeJson } from './storage.js';

const SETTINGS_STORAGE_KEY = 'survive_settings_v1';

const DEFAULT_SETTINGS = {
  contrastMode: false,
  largeFont: false
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...readJson(SETTINGS_STORAGE_KEY, {}) };
}

export function saveSettings(settings) {
  return writeJson(SETTINGS_STORAGE_KEY, settings);
}

export function updateSettings(patch) {
  const next = { ...getSettings(), ...patch };
  saveSettings(next);
  return next;
}
