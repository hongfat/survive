import { readJson, writeJson } from './storage.js';

const STORAGE_KEY = 'survive_gobag_checklist_v1';
const EXPIRY_STORAGE_KEY = 'survive_checklist_expiry_v1';
const REVIEW_STORAGE_KEY = 'survive_checklist_reviewed_v1';

export const EXPIRY_WARN_DAYS = 30;
export const REVIEW_INTERVAL_DAYS = 180;

// 勾選狀態 { itemId: true }
export function getChecklistState() {
  return readJson(STORAGE_KEY, {});
}

export function saveChecklistState(state) {
  return writeJson(STORAGE_KEY, state);
}

export function setChecklistItem(itemId, checked) {
  const current = getChecklistState();
  if (checked) {
    current[itemId] = true;
  } else {
    delete current[itemId];
  }
  saveChecklistState(current);
}

export function calculateProgress(items, state) {
  if (!items || items.length === 0) return { checked: 0, total: 0, percent: 0 };
  const checkedCount = items.filter(item => state[item.id]).length;
  const percent = Math.round((checkedCount / items.length) * 100);
  return {
    checked: checkedCount,
    total: items.length,
    percent
  };
}

// 物資有效期限 { itemId: 'YYYY-MM-DD' }
export function getExpiryDates() {
  return readJson(EXPIRY_STORAGE_KEY, {});
}

export function saveExpiryDates(dates) {
  return writeJson(EXPIRY_STORAGE_KEY, dates);
}

export function setExpiryDate(itemId, date) {
  const current = getExpiryDates();
  if (isValidDateString(date)) {
    current[itemId] = date;
  } else {
    delete current[itemId];
  }
  saveExpiryDates(current);
}

// 上次點檢日期 { guideId: 'YYYY-MM-DD' }
export function getReviewDates() {
  return readJson(REVIEW_STORAGE_KEY, {});
}

export function saveReviewDates(dates) {
  return writeJson(REVIEW_STORAGE_KEY, dates);
}

export function markReviewed(guideId, date = todayString()) {
  const current = getReviewDates();
  current[guideId] = date;
  saveReviewDates(current);
}

export function isReviewOverdue(reviewDate, now = new Date()) {
  return isValidDateString(reviewDate) && -daysUntil(reviewDate, now) > REVIEW_INTERVAL_DAYS;
}

export function getExpiryStatus(dateStr, now = new Date()) {
  if (!isValidDateString(dateStr)) return null;
  const days = daysUntil(dateStr, now);
  if (days < 0) return { level: 'expired', days };
  if (days <= EXPIRY_WARN_DAYS) return { level: 'soon', days };
  return { level: 'ok', days };
}

export function summarizeExpiry(items, expiryDates, now = new Date()) {
  const summary = { expired: 0, soon: 0 };
  (items || []).forEach(item => {
    const status = getExpiryStatus(expiryDates[item.id], now);
    if (status && status.level !== 'ok') summary[status.level] += 1;
  });
  return summary;
}

// 日期工具（一律以本地時區的日期計算）
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

export function isValidDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && parseLocalDate(value) !== null;
}

export function todayString(now = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function daysUntil(dateStr, now = new Date()) {
  const target = parseLocalDate(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}
