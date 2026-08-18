import { SURVIVAL_CATEGORIES, SURVIVAL_GUIDES } from './data.js';
import { filterGuides, highlightText } from './search.js';
import { calculateSurviveSupplies } from './calculator.js';
import { startSosSignal, stopSosSignal, isSosRunning } from './sos.js';
import { getChecklistState, toggleChecklistItem, calculateProgress } from './checklist.js';
import { getEmergencyMemo, saveEmergencyMemo } from './memo.js';

// Application State
let state = {
  activeCategory: 'all',
  searchQuery: '',
  contrastMode: false
};

// DOM Elements
const categoriesTabsContainer = document.getElementById('categories-tabs');
const guidesGridContainer = document.getElementById('guides-grid');
const searchInput = document.getElementById('search-input');

// Modal Elements - Calculator
const calcModal = document.getElementById('calc-modal');
const btnCalcTrigger = document.getElementById('btn-calc-trigger');
const cardCalcBtn = document.getElementById('card-calc-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Modal Elements - Emergency Memo
const memoModal = document.getElementById('memo-modal');
const btnMemoTrigger = document.getElementById('btn-memo-trigger');
const cardMemoBtn = document.getElementById('card-memo-btn');
const memoCloseBtn = document.getElementById('memo-close-btn');
const memoSaveBtn = document.getElementById('memo-save-btn');

// SOS Elements
const btnSosTrigger = document.getElementById('btn-sos-trigger');
const cardSosBtn = document.getElementById('card-sos-btn');
const sosOverlay = document.getElementById('sos-overlay');

// Other Buttons
const btnPrint = document.getElementById('btn-print');
const btnContrast = document.getElementById('btn-contrast');
const cardSaveBtn = document.getElementById('card-save-btn');
const cacheStatusText = document.getElementById('cache-status');
const printDateSpan = document.getElementById('print-date');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initPwaServiceWorker();
  renderCategoryTabs();
  renderGuides();
  setupEventListeners();
  updateCalculatorResults();
  loadEmergencyMemoToForm();
  
  if (printDateSpan) {
    printDateSpan.textContent = new Date().toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});

// PWA Service Worker Registration
function initPwaServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          if (cacheStatusText) {
            cacheStatusText.textContent = '已開啓 PWA 離線快取（無需網路可造訪）';
          }
        })
        .catch(err => {
          if (cacheStatusText) {
            cacheStatusText.textContent = '本地離線模式';
          }
        });
    });
  } else if (cacheStatusText) {
    cacheStatusText.textContent = '離線靜態檔案模式';
  }
}

// Render Category Tabs
function renderCategoryTabs() {
  categoriesTabsContainer.innerHTML = SURVIVAL_CATEGORIES.map(cat => `
    <button class="tab-btn ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
      ${cat.name}
    </button>
  `).join('');

  categoriesTabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.dataset.category;
      renderCategoryTabs();
      renderGuides();
    });
  });
}

// Render Survival Guide Cards
function renderGuides() {
  const filtered = filterGuides(SURVIVAL_GUIDES, {
    categoryId: state.activeCategory,
    searchQuery: state.searchQuery
  });

  if (filtered.length === 0) {
    guidesGridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
        <p style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">查無符合的生存指南</p>
        <p style="font-size: 0.9rem;">請嘗試搜尋其他關鍵字（如：止血、淨水、避難、水、止痛）。</p>
      </div>
    `;
    return;
  }

  const checklistState = getChecklistState();

  guidesGridContainer.innerHTML = filtered.map(guide => {
    const badgeClass = guide.severity === 'critical' ? 'badge-critical'
      : guide.severity === 'warning' ? 'badge-warning' : 'badge-info';
    
    const badgeText = guide.severity === 'critical' ? '緊急危急'
      : guide.severity === 'warning' ? '重要防護' : '基礎備忘';

    const highlightedTitle = highlightText(guide.title, state.searchQuery);
    const highlightedSummary = highlightText(guide.summary, state.searchQuery);

    let contentHtml = '';

    if (guide.isInteractiveChecklist && guide.items) {
      const progress = calculateProgress(guide.items, checklistState);
      const progressHtml = `
        <div class="checklist-progress-box">
          <div class="checklist-progress-header">
            <span>避難包準備進度</span>
            <span>${progress.checked} / ${progress.total} 項已備妥 (${progress.percent}%)</span>
          </div>
          <div class="checklist-progress-bar">
            <div class="checklist-progress-fill" style="width: ${progress.percent}%"></div>
          </div>
        </div>
      `;

      const itemsHtml = guide.items.map(item => {
        const isChecked = !!checklistState[item.id];
        const highlightedItemText = highlightText(item.text, state.searchQuery);
        return `
          <div class="checklist-item-row ${isChecked ? 'checked' : ''}" data-item-id="${item.id}">
            <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''}>
            <label for="${item.id}" class="checklist-item-text">${highlightedItemText}</label>
          </div>
        `;
      }).join('');

      contentHtml = progressHtml + `<div class="checklist-items-list">${itemsHtml}</div>`;
    } else {
      const stepsHtml = (guide.steps || []).map(step => `
        <li>${highlightText(step, state.searchQuery)}</li>
      `).join('');
      contentHtml = `<ol class="steps-list">${stepsHtml}</ol>`;
    }

    const tipsHtml = guide.tips ? `
      <div class="guide-tips">
        <strong>注意事項與技巧：</strong>
        ${guide.tips.map(tip => `<div>• ${highlightText(tip, state.searchQuery)}</div>`).join('')}
      </div>
    ` : '';

    return `
      <article class="guide-card">
        <div class="guide-header">
          <h3 class="guide-title">${highlightedTitle}</h3>
          <span class="badge-severity ${badgeClass}">${badgeText}</span>
        </div>
        <p class="guide-summary">${highlightedSummary}</p>
        ${contentHtml}
        ${tipsHtml}
      </article>
    `;
  }).join('');

  // Bind checklist checkboxes
  guidesGridContainer.querySelectorAll('.checklist-item-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
      }
      const itemId = row.dataset.itemId;
      toggleChecklistItem(itemId);
      renderGuides();
    });
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Real-time Search
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderGuides();
  });

  // Modal Triggers - Calculator
  btnCalcTrigger.addEventListener('click', openCalcModal);
  cardCalcBtn.addEventListener('click', openCalcModal);
  modalCloseBtn.addEventListener('click', closeCalcModal);
  calcModal.addEventListener('click', (e) => {
    if (e.target === calcModal) closeCalcModal();
  });

  // Modal Triggers - Emergency Memo
  if (btnMemoTrigger) btnMemoTrigger.addEventListener('click', openMemoModal);
  if (cardMemoBtn) cardMemoBtn.addEventListener('click', openMemoModal);
  if (memoCloseBtn) memoCloseBtn.addEventListener('click', closeMemoModal);
  if (memoModal) {
    memoModal.addEventListener('click', (e) => {
      if (e.target === memoModal) closeMemoModal();
    });
  }
  if (memoSaveBtn) {
    memoSaveBtn.addEventListener('click', handleSaveEmergencyMemo);
  }

  // Calculator inputs change
  ['calc-persons', 'calc-days', 'calc-season', 'calc-vulnerable'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCalculatorResults);
  });

  // SOS Signal Trigger
  const toggleSos = () => {
    if (isSosRunning()) {
      stopSosSignal({ onBlinkChange: handleSosBlink });
      btnSosTrigger.classList.remove('active');
      cardSosBtn.classList.remove('active');
      btnSosTrigger.querySelector('span').textContent = 'SOS 求救';
      cardSosBtn.textContent = '啟動求救';
    } else {
      startSosSignal({ onBlinkChange: handleSosBlink });
      btnSosTrigger.classList.add('active');
      cardSosBtn.classList.add('active');
      btnSosTrigger.querySelector('span').textContent = '停止求救';
      cardSosBtn.textContent = '停止求救';
    }
  };

  btnSosTrigger.addEventListener('click', toggleSos);
  cardSosBtn.addEventListener('click', toggleSos);

  // Print Manual Button
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // High Contrast Mode Toggle
  btnContrast.addEventListener('click', () => {
    state.contrastMode = !state.contrastMode;
    document.body.classList.toggle('contrast-mode', state.contrastMode);
  });

  // Download Single HTML File
  cardSaveBtn.addEventListener('click', downloadSingleHtml);
}

function handleSosBlink(isBlinking) {
  if (isBlinking) {
    sosOverlay.classList.add('blink-active');
  } else {
    sosOverlay.classList.remove('blink-active');
  }
}

function openCalcModal() {
  calcModal.classList.add('active');
}

function closeCalcModal() {
  calcModal.classList.remove('active');
}

function openMemoModal() {
  loadEmergencyMemoToForm();
  memoModal.classList.add('active');
}

function closeMemoModal() {
  memoModal.classList.remove('active');
}

function loadEmergencyMemoToForm() {
  const memo = getEmergencyMemo();
  if (document.getElementById('memo-name')) document.getElementById('memo-name').value = memo.name || '';
  if (document.getElementById('memo-blood')) document.getElementById('memo-blood').value = memo.bloodType || '';
  if (document.getElementById('memo-contact-name')) document.getElementById('memo-contact-name').value = memo.contactName || '';
  if (document.getElementById('memo-contact-phone')) document.getElementById('memo-contact-phone').value = memo.contactPhone || '';
  if (document.getElementById('memo-disaster-app-phone')) document.getElementById('memo-disaster-app-phone').value = memo.disasterAppPhone || '';
  if (document.getElementById('memo-meeting-point')) document.getElementById('memo-meeting-point').value = memo.meetingPoint || '';
  if (document.getElementById('memo-secondary-meeting-point')) document.getElementById('memo-secondary-meeting-point').value = memo.secondaryMeetingPoint || '';
  if (document.getElementById('memo-notes')) document.getElementById('memo-notes').value = memo.notes || '';
}

function handleSaveEmergencyMemo() {
  const memoData = {
    name: document.getElementById('memo-name')?.value || '',
    bloodType: document.getElementById('memo-blood')?.value || '',
    contactName: document.getElementById('memo-contact-name')?.value || '',
    contactPhone: document.getElementById('memo-contact-phone')?.value || '',
    disasterAppPhone: document.getElementById('memo-disaster-app-phone')?.value || '',
    meetingPoint: document.getElementById('memo-meeting-point')?.value || '',
    secondaryMeetingPoint: document.getElementById('memo-secondary-meeting-point')?.value || '',
    notes: document.getElementById('memo-notes')?.value || ''
  };

  saveEmergencyMemo(memoData);
  alert('個人離線緊急聯絡備忘錄已儲存！');
  closeMemoModal();
}

function updateCalculatorResults() {
  const persons = document.getElementById('calc-persons').value;
  const days = document.getElementById('calc-days').value;
  const season = document.getElementById('calc-season').value;
  const hasVulnerable = document.getElementById('calc-vulnerable').checked;

  const res = calculateSurviveSupplies({ persons, days, season, hasVulnerable });

  document.getElementById('res-water').textContent = res.totalWater;
  document.getElementById('res-calories').textContent = res.totalCalories;
  document.getElementById('res-rice').textContent = res.riceKg;
  document.getElementById('res-canned').textContent = res.cannedCount;
  document.getElementById('res-powerbank').textContent = res.powerbanksNeeded;
  document.getElementById('res-batteries').textContent = res.aaBatteriesNeeded;
}

function downloadSingleHtml() {
  const htmlContent = document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'survive_offline_manual.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
