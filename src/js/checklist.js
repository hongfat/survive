const STORAGE_KEY = 'survive_gobag_checklist_v1';

export function getChecklistState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export function toggleChecklistItem(itemId) {
  const current = getChecklistState();
  current[itemId] = !current[itemId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save checklist state:', e);
  }
  return current[itemId];
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
