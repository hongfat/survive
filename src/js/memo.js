const MEMO_STORAGE_KEY = 'survive_emergency_memo_v2';

const DEFAULT_MEMO = {
  name: '',
  bloodType: '',
  allergies: '',
  contactName: '',
  contactPhone: '',
  mnd1991Phone: '',
  meetingPoint: '',
  secondaryMeetingPoint: '',
  notes: ''
};

export function getEmergencyMemo() {
  try {
    const saved = localStorage.getItem(MEMO_STORAGE_KEY);
    return saved ? { ...DEFAULT_MEMO, ...JSON.parse(saved) } : DEFAULT_MEMO;
  } catch (e) {
    return DEFAULT_MEMO;
  }
}

export function saveEmergencyMemo(memoData) {
  try {
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memoData));
    return true;
  } catch (e) {
    console.error('Failed to save emergency memo:', e);
    return false;
  }
}
