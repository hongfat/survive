import { getEmergencyMemo, saveEmergencyMemo, MEMO_FIELDS } from './memo.js';
import {
  getChecklistState, saveChecklistState,
  getExpiryDates, saveExpiryDates,
  getReviewDates, saveReviewDates,
  isValidDateString
} from './checklist.js';
import { getSettings, saveSettings, SETTING_KEYS } from './settings.js';

const BACKUP_APP_ID = 'survive';
const BACKUP_VERSION = 1;
const ID_PATTERN = /^[a-z0-9][\w-]{0,63}$/i;
const MAX_TEXT_LENGTH = 1000;

export function buildBackup() {
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      memo: getEmergencyMemo(),
      checklist: getChecklistState(),
      expiry: getExpiryDates(),
      reviewed: getReviewDates(),
      settings: getSettings()
    }
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function pickEntries(obj, isValidValue) {
  const out = {};
  if (!isPlainObject(obj)) return out;
  Object.keys(obj).forEach(key => {
    if (ID_PATTERN.test(key) && isValidValue(obj[key])) out[key] = obj[key];
  });
  return out;
}

// 匯入的檔案不可信任：只取已知欄位並驗證型別，其餘一律捨棄
export function restoreBackup(backup) {
  if (!isPlainObject(backup) || backup.app !== BACKUP_APP_ID || !isPlainObject(backup.data)) {
    throw new Error('不是有效的 Survive 備份檔');
  }
  if (typeof backup.version !== 'number' || backup.version > BACKUP_VERSION) {
    throw new Error('備份檔版本不相容，請先更新 App');
  }

  const { memo, checklist, expiry, reviewed, settings } = backup.data;

  const safeMemo = {};
  MEMO_FIELDS.forEach(field => {
    const value = isPlainObject(memo) ? memo[field] : '';
    safeMemo[field] = typeof value === 'string' ? value.slice(0, MAX_TEXT_LENGTH) : '';
  });

  const safeSettings = {};
  SETTING_KEYS.forEach(key => {
    safeSettings[key] = isPlainObject(settings) && settings[key] === true;
  });

  saveEmergencyMemo(safeMemo);
  saveChecklistState(pickEntries(checklist, v => v === true));
  saveExpiryDates(pickEntries(expiry, isValidDateString));
  saveReviewDates(pickEntries(reviewed, isValidDateString));
  saveSettings(safeSettings);
}
