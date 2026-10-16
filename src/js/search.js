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
    const inSteps = (guide.steps || []).some(step => step.toLowerCase().includes(query));
    const inTips = (guide.tips || []).some(tip => tip.toLowerCase().includes(query));
    const inItems = (guide.items || []).some(item => item.text.toLowerCase().includes(query));

    return inTitle || inSummary || inSteps || inTips || inItems;
  });
}

export function highlightText(text, query) {
  if (!query || !query.trim()) return text;
  const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 略過 HTML 標籤，只高亮標籤外的文字，避免破壞 <a href> 等屬性
  const regex = new RegExp(`(<[^>]*>)|(${q})`, 'gi');
  return text.replace(regex, (match, tag) => tag ? tag : `<mark class="highlight">${match}</mark>`);
}
