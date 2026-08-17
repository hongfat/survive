import { SURVIVAL_GUIDES } from './data.js';

export function filterGuides(guides, { categoryId = 'all', searchQuery = '' }) {
  const query = searchQuery.trim().toLowerCase();
  
  return guides.filter(guide => {
    // 類別過濾
    const matchCategory = categoryId === 'all' || guide.categoryId === categoryId;
    if (!matchCategory) return false;
    
    // 關鍵字搜尋
    if (!query) return true;
    
    const inTitle = guide.title.toLowerCase().includes(query);
    const inSummary = guide.summary.toLowerCase().includes(query);
    const inSteps = guide.steps.some(step => step.toLowerCase().includes(query));
    const inTips = guide.tips ? guide.tips.some(tip => tip.toLowerCase().includes(query)) : false;
    
    return inTitle || inSummary || inSteps || inTips;
  });
}

export function highlightText(text, query) {
  if (!query || !query.trim()) return text;
  const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${q})`, 'gi');
  return text.replace(regex, '<mark class="highlight">$1</mark>');
}
