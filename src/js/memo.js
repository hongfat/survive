import { readJson, writeJson } from './storage.js';

const MEMO_STORAGE_KEY = 'survive_emergency_memo_v3';

const DEFAULT_MEMO = {
  name: '',
  bloodType: '',
  allergies: '',
  contactName: '',
  contactPhone: '',
  disasterAppPhone: '',
  meetingPoint: '',
  secondaryMeetingPoint: '',
  notes: ''
};

export const MEMO_FIELDS = Object.keys(DEFAULT_MEMO);

export function getEmergencyMemo() {
  return { ...DEFAULT_MEMO, ...readJson(MEMO_STORAGE_KEY, {}) };
}

export function saveEmergencyMemo(memoData) {
  return writeJson(MEMO_STORAGE_KEY, memoData);
}

// 從自由輸入的文字（如「0912-345-678 / FRS Ch 1」）取出可撥打的號碼
export function extractPhoneNumber(text) {
  const match = String(text || '').match(/\+?\d[\d\s-]{2,}\d/);
  if (!match) return null;
  const number = match[0].replace(/[\s-]/g, '');
  return number.replace(/\D/g, '').length >= 3 ? number : null;
}
