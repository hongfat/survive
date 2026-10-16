import { SURVIVAL_CATEGORIES, SURVIVAL_GUIDES } from './data.js';
import { filterGuides, highlightText } from './search.js';
import { calculateSurviveSupplies } from './calculator.js';
import { startSosSignal, stopSosSignal, isSosRunning } from './sos.js';
import {
  getChecklistState, setChecklistItem, calculateProgress,
  getExpiryDates, setExpiryDate, getExpiryStatus, summarizeExpiry,
  getReviewDates, markReviewed, isReviewOverdue,
  daysUntil, todayString, EXPIRY_WARN_DAYS, REVIEW_INTERVAL_DAYS
} from './checklist.js';
import { getEmergencyMemo, saveEmergencyMemo, extractPhoneNumber } from './memo.js';
import { getSettings, updateSettings } from './settings.js';
import { buildBackup, restoreBackup } from './backup.js';
import { startFlashlight, startScreenLight, stopLight, getLightMode } from './light.js';

// Application State
let state = {
  activeCategory: 'all',
  searchQuery: '',
  expanded: {} // guideId -> 使用者手動展開/收合的狀態
};

let lastCalcResult = null;

// DOM Elements
const categoriesTabsContainer = document.getElementById('categories-tabs');
const guidesGridContainer = document.getElementById('guides-grid');
const searchInput = document.getElementById('search-input');
const noticeArea = document.getElementById('notice-area');
const toastEl = document.getElementById('toast');

// Modal Elements - Calculator
const calcModal = document.getElementById('calc-modal');
const btnCalcTrigger = document.getElementById('btn-calc-trigger');
const cardCalcBtn = document.getElementById('card-calc-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const calcCopyBtn = document.getElementById('calc-copy-btn');

// Modal Elements - Emergency Memo
const memoModal = document.getElementById('memo-modal');
const btnMemoTrigger = document.getElementById('btn-memo-trigger');
const cardMemoBtn = document.getElementById('card-memo-btn');
const memoCloseBtn = document.getElementById('memo-close-btn');
const memoSaveBtn = document.getElementById('memo-save-btn');
const memoQuickDial = document.getElementById('memo-quick-dial');

// SOS & Light Elements
const btnSosTrigger = document.getElementById('btn-sos-trigger');
const cardSosBtn = document.getElementById('card-sos-btn');
const sosOverlay = document.getElementById('sos-overlay');
const btnFlashlight = document.getElementById('btn-flashlight');
const btnScreenLight = document.getElementById('btn-screenlight');
const lightOverlay = document.getElementById('light-overlay');

// Backup Elements
const btnBackupExport = document.getElementById('btn-backup-export');
const btnBackupImport = document.getElementById('btn-backup-import');
const backupFileInput = document.getElementById('backup-file-input');

// Other Buttons
const btnPrint = document.getElementById('btn-print');
const btnContrast = document.getElementById('btn-contrast');
const btnFont = document.getElementById('btn-font');
const cardSaveBtn = document.getElementById('card-save-btn');
const cacheStatusText = document.getElementById('cache-status');
const netStatusText = document.getElementById('net-status');
const printDateSpan = document.getElementById('print-date');

// 備忘錄欄位 -> 表單元素 id
const MEMO_FORM_FIELDS = {
  name: 'memo-name',
  bloodType: 'memo-blood',
  allergies: 'memo-allergies',
  contactName: 'memo-contact-name',
  contactPhone: 'memo-contact-phone',
  disasterAppPhone: 'memo-disaster-app-phone',
  meetingPoint: 'memo-meeting-point',
  secondaryMeetingPoint: 'memo-secondary-meeting-point',
  notes: 'memo-notes'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  initPwaServiceWorker();
  renderCategoryTabs();
  renderGuides();
  setupEventListeners();
  updateCalculatorResults();
  loadEmergencyMemoToForm();
  renderQuickDial();
  refreshChecklistNotices();
  openGuideFromHash();

  if (printDateSpan) {
    printDateSpan.textContent = new Date().toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});

// PWA Service Worker Registration & Network Status
function initPwaServiceWorker() {
  updateNetworkStatus();
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);

  if (!('serviceWorker' in navigator)) {
    if (cacheStatusText) cacheStatusText.textContent = '離線靜態檔案模式';
    return;
  }

  // 已有舊版 SW 控制頁面時，新版接手代表內容已更新
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    showCacheVersion();
    if (hadController) {
      setNotice('sw-update', {
        type: 'info',
        text: '已下載新版內容，重新整理後即可使用最新版本。',
        actions: [{ label: '立即重新整理', primary: true, onClick: () => location.reload() }]
      });
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => showCacheVersion())
      .catch(() => {
        if (cacheStatusText) cacheStatusText.textContent = '本地離線模式';
      });
  });
}

async function showCacheVersion() {
  if (!cacheStatusText) return;
  try {
    const keys = await caches.keys();
    const name = keys.find(key => key.startsWith('survive-'));
    cacheStatusText.textContent = name
      ? `已開啓 PWA 離線快取（${name}）`
      : '已開啓 PWA 離線快取（無需網路可造訪）';
  } catch (e) {
    cacheStatusText.textContent = '已開啓 PWA 離線快取（無需網路可造訪）';
  }
}

function updateNetworkStatus() {
  if (!netStatusText) return;
  const online = navigator.onLine;
  netStatusText.textContent = online ? '線上' : '離線（使用快取內容）';
  netStatusText.classList.toggle('offline', !online);
}

// Settings (contrast / large font)
function applySettings() {
  const settings = getSettings();
  document.body.classList.toggle('contrast-mode', settings.contrastMode);
  document.documentElement.classList.toggle('large-font', settings.largeFont);
  btnContrast.setAttribute('aria-pressed', String(settings.contrastMode));
  btnFont.setAttribute('aria-pressed', String(settings.largeFont));
}

// Notices
const notices = new Map();
const dismissedNotices = new Set();

function setNotice(id, notice) {
  if (notice && !dismissedNotices.has(id)) {
    notices.set(id, notice);
  } else {
    notices.delete(id);
  }
  renderNotices();
}

function renderNotices() {
  noticeArea.textContent = '';
  notices.forEach((notice, id) => {
    const el = document.createElement('div');
    el.className = `notice notice-${notice.type}`;

    const text = document.createElement('span');
    text.className = 'notice-text';
    text.textContent = notice.text;
    el.appendChild(text);

    const actions = document.createElement('div');
    actions.className = 'notice-actions';
    (notice.actions || []).forEach(action => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = action.primary ? 'btn btn-sm btn-amber' : 'btn btn-sm';
      btn.textContent = action.label;
      btn.addEventListener('click', action.onClick);
      actions.appendChild(btn);
    });

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'notice-close';
    close.setAttribute('aria-label', '關閉提醒');
    close.textContent = '×';
    close.addEventListener('click', () => {
      dismissedNotices.add(id);
      setNotice(id, null);
    });
    actions.appendChild(close);

    el.appendChild(actions);
    noticeArea.appendChild(el);
  });
}

function refreshChecklistNotices() {
  const checklistGuides = SURVIVAL_GUIDES.filter(g => g.isInteractiveChecklist);
  const expiryDates = getExpiryDates();
  const reviewDates = getReviewDates();

  let expired = 0;
  let soon = 0;
  checklistGuides.forEach(guide => {
    const summary = summarizeExpiry(guide.items, expiryDates);
    expired += summary.expired;
    soon += summary.soon;
  });

  const parts = [];
  if (expired) parts.push(`${expired} 項已過期`);
  if (soon) parts.push(`${soon} 項將於 ${EXPIRY_WARN_DAYS} 天內到期`);
  setNotice('expiry', parts.length ? {
    type: 'warning',
    text: `物資效期提醒：${parts.join('、')}，請盡快更換。`,
    actions: [{ label: '查看清單', primary: true, onClick: showChecklistCategory }]
  } : null);

  const overdue = checklistGuides.some(guide => isReviewOverdue(reviewDates[guide.id]));
  setNotice('review', overdue ? {
    type: 'info',
    text: `距離上次點檢避難包已超過 ${REVIEW_INTERVAL_DAYS} 天，建議重新檢查物資狀態。`,
    actions: [{ label: '前往點檢', onClick: showChecklistCategory }]
  } : null);
}

function showChecklistCategory() {
  state.activeCategory = 'checklist';
  state.searchQuery = '';
  searchInput.value = '';
  SURVIVAL_GUIDES.filter(g => g.isInteractiveChecklist).forEach(g => {
    state.expanded[g.id] = true;
  });
  renderCategoryTabs();
  renderGuides();
  categoriesTabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toast
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
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

function isGuideExpanded(guide) {
  if (guide.id in state.expanded) return state.expanded[guide.id];
  // 搜尋或選定單一分類時展開所有結果；「全部指南」只展開「緊急危急」
  return !!state.searchQuery.trim() || state.activeCategory !== 'all' || guide.severity === 'critical';
}

function renderChecklistContent(guide, checklistState, expiryDates, reviewDates) {
  const progress = calculateProgress(guide.items, checklistState);
  const expirySummary = summarizeExpiry(guide.items, expiryDates);
  const expiryWarnings = [];
  if (expirySummary.expired) expiryWarnings.push(`${expirySummary.expired} 項已過期`);
  if (expirySummary.soon) expiryWarnings.push(`${expirySummary.soon} 項即將到期`);

  const progressHtml = `
    <div class="checklist-progress-box">
      <div class="checklist-progress-header">
        <span>避難包準備進度</span>
        <span>${progress.checked} / ${progress.total} 項已備妥 (${progress.percent}%)</span>
      </div>
      <div class="checklist-progress-bar">
        <div class="checklist-progress-fill" style="width: ${progress.percent}%"></div>
      </div>
      ${expiryWarnings.length ? `<p class="checklist-expiry-summary">${expiryWarnings.join('、')}</p>` : ''}
    </div>
    <p class="checklist-hint">可為食物、飲水、藥品等填寫有效期限，到期前 ${EXPIRY_WARN_DAYS} 天會提醒。</p>
  `;

  const itemsHtml = guide.items.map(item => {
    const isChecked = !!checklistState[item.id];
    const expiryDate = expiryDates[item.id] || '';
    const status = getExpiryStatus(expiryDate);
    let badgeHtml = '';
    if (status && status.level === 'expired') {
      badgeHtml = '<span class="expiry-badge expiry-expired">已過期</span>';
    } else if (status && status.level === 'soon') {
      badgeHtml = `<span class="expiry-badge expiry-soon">${status.days === 0 ? '今天到期' : `${status.days} 天後到期`}</span>`;
    }
    return `
      <div class="checklist-item-row ${isChecked ? 'checked' : ''}">
        <input type="checkbox" class="checklist-checkbox" id="${item.id}" data-item-id="${item.id}" ${isChecked ? 'checked' : ''}>
        <label for="${item.id}" class="checklist-item-text">${highlightText(item.text, state.searchQuery)}</label>
        <div class="expiry-field">
          <input type="date" class="expiry-input" data-item-id="${item.id}" value="${expiryDate}"
            title="有效期限（選填）" aria-label="有效期限（選填）">
          ${badgeHtml}
        </div>
      </div>
    `;
  }).join('');

  const reviewDate = reviewDates[guide.id];
  const overdue = isReviewOverdue(reviewDate);
  const reviewText = reviewDate
    ? `上次點檢：${reviewDate}（${-daysUntil(reviewDate)} 天前）${overdue ? '，建議重新點檢' : ''}`
    : '尚未記錄點檢日期';
  const reviewHtml = `
    <div class="review-row ${overdue ? 'overdue' : ''}">
      <span>${reviewText}</span>
      <button type="button" class="btn btn-sm review-btn" data-guide-id="${guide.id}">完成點檢</button>
    </div>
  `;

  return progressHtml + `<div class="checklist-items-list">${itemsHtml}</div>` + reviewHtml;
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
  const expiryDates = getExpiryDates();
  const reviewDates = getReviewDates();

  guidesGridContainer.innerHTML = filtered.map(guide => {
    const badgeClass = guide.severity === 'critical' ? 'badge-critical'
      : guide.severity === 'warning' ? 'badge-warning' : 'badge-info';

    const badgeText = guide.severity === 'critical' ? '緊急危急'
      : guide.severity === 'warning' ? '重要防護' : '基礎備忘';

    const highlightedTitle = highlightText(guide.title, state.searchQuery);
    const highlightedSummary = highlightText(guide.summary, state.searchQuery);
    const expanded = isGuideExpanded(guide);

    let contentHtml = '';

    if (guide.isInteractiveChecklist && guide.items) {
      contentHtml = renderChecklistContent(guide, checklistState, expiryDates, reviewDates);
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
      <article class="guide-card" id="guide-${guide.id}" data-guide-id="${guide.id}">
        <div class="guide-header">
          <h3 class="guide-title">
            <button type="button" class="guide-toggle" data-guide-id="${guide.id}"
              aria-expanded="${expanded}" aria-controls="guide-body-${guide.id}">
              <span class="guide-chevron" aria-hidden="true"></span>
              <span>${highlightedTitle}</span>
            </button>
          </h3>
          <div class="guide-meta">
            <span class="badge-severity ${badgeClass}">${badgeText}</span>
            <a class="guide-link" href="#guide-${guide.id}" data-guide-id="${guide.id}"
              title="複製此指南連結" aria-label="複製此指南連結">#</a>
          </div>
        </div>
        <p class="guide-summary">${highlightedSummary}</p>
        <div class="guide-body" id="guide-body-${guide.id}" ${expanded ? '' : 'hidden'}>
          ${contentHtml}
          ${tipsHtml}
        </div>
      </article>
    `;
  }).join('');
}

// 重新渲染後把焦點還給原本操作的元素（鍵盤使用者不會跳回頁首）
function renderGuidesKeepFocus(selector) {
  renderGuides();
  const el = guidesGridContainer.querySelector(selector);
  if (el) el.focus({ preventScroll: true });
}

function toggleGuide(guideId) {
  const guide = SURVIVAL_GUIDES.find(g => g.id === guideId);
  if (!guide) return;
  const expanded = !isGuideExpanded(guide);
  state.expanded[guideId] = expanded;

  const card = document.getElementById(`guide-${guideId}`);
  if (!card) return;
  card.querySelector('.guide-toggle').setAttribute('aria-expanded', String(expanded));
  card.querySelector('.guide-body').hidden = !expanded;
}

async function shareGuideLink(guideId) {
  const hash = `#guide-${guideId}`;
  const url = location.href.split('#')[0] + hash;
  history.replaceState(null, '', hash);
  const ok = await copyText(url);
  showToast(ok ? '已複製此指南連結' : `指南連結：${url}`);
}

// 開啟網址 #guide-xxx 指定的指南
function openGuideFromHash() {
  const match = location.hash.match(/^#guide-([\w-]+)$/);
  if (!match) return;
  const guideId = match[1];
  const guide = SURVIVAL_GUIDES.find(g => g.id === guideId);
  if (!guide) return;

  const visible = filterGuides(SURVIVAL_GUIDES, {
    categoryId: state.activeCategory,
    searchQuery: state.searchQuery
  }).includes(guide);
  if (!visible) {
    state.activeCategory = 'all';
    state.searchQuery = '';
    searchInput.value = '';
    renderCategoryTabs();
  }
  state.expanded[guideId] = true;
  renderGuides();

  const card = document.getElementById(`guide-${guideId}`);
  if (card) card.scrollIntoView({ block: 'start' });
}

// Setup Event Listeners
function setupEventListeners() {
  // Real-time Search
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.expanded = {};
    renderGuides();
  });

  // Guide cards (event delegation)
  guidesGridContainer.addEventListener('click', (e) => {
    const toggle = e.target.closest('.guide-toggle');
    if (toggle) {
      toggleGuide(toggle.dataset.guideId);
      return;
    }
    const link = e.target.closest('.guide-link');
    if (link) {
      e.preventDefault();
      shareGuideLink(link.dataset.guideId);
      return;
    }
    const reviewBtn = e.target.closest('.review-btn');
    if (reviewBtn) {
      markReviewed(reviewBtn.dataset.guideId);
      renderGuidesKeepFocus(`.review-btn[data-guide-id="${reviewBtn.dataset.guideId}"]`);
      refreshChecklistNotices();
      showToast(`已記錄 ${todayString()} 完成點檢`);
    }
  });

  guidesGridContainer.addEventListener('change', (e) => {
    const target = e.target;
    if (target.classList.contains('checklist-checkbox')) {
      const guideId = target.closest('.guide-card').dataset.guideId;
      setChecklistItem(target.dataset.itemId, target.checked);
      // 第一次勾選時記錄為點檢起始日，作為半年重新點檢提醒的基準
      if (target.checked && !getReviewDates()[guideId]) markReviewed(guideId);
      renderGuidesKeepFocus(`#${target.id}`);
      refreshChecklistNotices();
    } else if (target.classList.contains('expiry-input')) {
      setExpiryDate(target.dataset.itemId, target.value);
      renderGuidesKeepFocus(`.expiry-input[data-item-id="${target.dataset.itemId}"]`);
      refreshChecklistNotices();
    }
  });

  window.addEventListener('hashchange', openGuideFromHash);

  // Modal Triggers - Calculator
  btnCalcTrigger.addEventListener('click', openCalcModal);
  cardCalcBtn.addEventListener('click', openCalcModal);
  modalCloseBtn.addEventListener('click', closeCalcModal);
  calcModal.addEventListener('click', (e) => {
    if (e.target === calcModal) closeCalcModal();
  });
  calcCopyBtn.addEventListener('click', handleCopyShoppingList);

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
      stopSos();
    } else {
      startSos();
    }
  };

  btnSosTrigger.addEventListener('click', toggleSos);
  cardSosBtn.addEventListener('click', toggleSos);

  // Light Tools
  btnFlashlight.addEventListener('click', handleFlashlight);
  btnScreenLight.addEventListener('click', openScreenLight);
  lightOverlay.addEventListener('click', stopLightMode);

  // Backup
  btnBackupExport.addEventListener('click', handleExportBackup);
  btnBackupImport.addEventListener('click', () => backupFileInput.click());
  backupFileInput.addEventListener('change', handleImportBackup);

  // Print Manual Button
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // High Contrast Mode Toggle
  btnContrast.addEventListener('click', () => {
    updateSettings({ contrastMode: !getSettings().contrastMode });
    applySettings();
  });

  // Large Font Toggle
  btnFont.addEventListener('click', () => {
    updateSettings({ largeFont: !getSettings().largeFont });
    applySettings();
  });

  // Download Single HTML File
  cardSaveBtn.addEventListener('click', downloadSingleHtml);

  // Escape closes overlays
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (getLightMode() === 'screen') stopLightMode();
    closeCalcModal();
    closeMemoModal();
  });
}

function setSosUi(active) {
  btnSosTrigger.classList.toggle('active', active);
  cardSosBtn.classList.toggle('active', active);
  btnSosTrigger.querySelector('span').textContent = active ? '停止求救' : 'SOS 求救';
  cardSosBtn.textContent = active ? '停止求救' : '啟動求救';
}

// SOS 與照明共用閃光燈，同時間只能啟用一種
function startSos() {
  stopLightMode();
  startSosSignal({ onBlinkChange: handleSosBlink });
  setSosUi(true);
}

function stopSos() {
  stopSosSignal({ onBlinkChange: handleSosBlink });
  setSosUi(false);
}

function handleSosBlink(isBlinking) {
  if (isBlinking) {
    sosOverlay.classList.add('blink-active');
  } else {
    sosOverlay.classList.remove('blink-active');
  }
}

async function handleFlashlight() {
  if (getLightMode() === 'torch') {
    stopLightMode();
    return;
  }
  stopLightMode();
  if (isSosRunning()) stopSos();

  const mode = await startFlashlight();
  if (mode === 'torch') {
    updateLightUi();
    showToast('手電筒已開啟，再按一次關閉');
  } else {
    showToast('此裝置或瀏覽器不支援控制閃光燈，已改用螢幕白光');
    openScreenLight();
  }
}

function openScreenLight() {
  stopLightMode();
  if (isSosRunning()) stopSos();
  startScreenLight();
  lightOverlay.classList.add('active');
  updateLightUi();
}

function stopLightMode() {
  stopLight();
  lightOverlay.classList.remove('active');
  updateLightUi();
}

function updateLightUi() {
  const torchOn = getLightMode() === 'torch';
  btnFlashlight.setAttribute('aria-pressed', String(torchOn));
  btnFlashlight.textContent = torchOn ? '關閉手電筒' : '手電筒';
  btnFlashlight.classList.toggle('btn-amber', torchOn);
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
  Object.keys(MEMO_FORM_FIELDS).forEach(field => {
    const el = document.getElementById(MEMO_FORM_FIELDS[field]);
    if (el) el.value = memo[field] || '';
  });
}

function handleSaveEmergencyMemo() {
  const memoData = {};
  Object.keys(MEMO_FORM_FIELDS).forEach(field => {
    const el = document.getElementById(MEMO_FORM_FIELDS[field]);
    memoData[field] = el ? el.value : '';
  });

  const ok = saveEmergencyMemo(memoData);
  renderQuickDial();
  closeMemoModal();
  showToast(ok ? '個人離線緊急聯絡備忘錄已儲存' : '儲存失敗，瀏覽器可能停用了本機儲存');
}

// 聯絡卡快速撥號（使用者輸入的資料一律用 textContent，不經過 innerHTML）
function renderQuickDial() {
  if (!memoQuickDial) return;
  const memo = getEmergencyMemo();
  const entries = [
    { label: memo.contactName ? `撥給 ${memo.contactName}` : '撥給緊急聯絡人', phone: extractPhoneNumber(memo.contactPhone) },
    { label: '撥打報平安約定電話', phone: extractPhoneNumber(memo.disasterAppPhone) }
  ].filter(entry => entry.phone);

  memoQuickDial.textContent = '';
  entries.forEach(entry => {
    const a = document.createElement('a');
    a.className = 'btn btn-sm btn-call';
    a.href = `tel:${entry.phone}`;
    a.textContent = entry.label;
    a.title = entry.phone;
    memoQuickDial.appendChild(a);
  });
  memoQuickDial.hidden = entries.length === 0;
}

function updateCalculatorResults() {
  const persons = document.getElementById('calc-persons').value;
  const days = document.getElementById('calc-days').value;
  const season = document.getElementById('calc-season').value;
  const hasVulnerable = document.getElementById('calc-vulnerable').checked;

  const res = calculateSurviveSupplies({ persons, days, season, hasVulnerable });
  lastCalcResult = res;

  document.getElementById('res-water').textContent = res.totalWater;
  document.getElementById('res-drinking').textContent = res.drinkingWater;
  document.getElementById('res-sanitation').textContent = res.sanitationWater;
  document.getElementById('res-calories').textContent = res.totalCalories;
  document.getElementById('res-rice').textContent = res.riceKg;
  document.getElementById('res-canned').textContent = res.cannedCount;
  document.getElementById('res-powerbank').textContent = res.powerbanksNeeded;
  document.getElementById('res-batteries').textContent = res.aaBatteriesNeeded;
  document.getElementById('res-salt').textContent = res.saltGrams;
  document.getElementById('res-masks').textContent = res.maskCount;
}

function buildShoppingList(res) {
  return [
    `【防災物資採購清單】${res.persons} 人 × ${res.days} 天`,
    `・飲用水 ${res.drinkingWater} 公升`,
    `・清潔料理用水 ${res.sanitationWater} 公升`,
    `・米糧 / 主食 ${res.riceKg} 公斤`,
    `・常溫罐頭 ${res.cannedCount} 罐`,
    `・20000mAh 行動電源 ${res.powerbanksNeeded} 個`,
    `・AA 電池 ${res.aaBatteriesNeeded} 顆`,
    `・電解質 / 食鹽 ${res.saltGrams} 克`,
    `・口罩 ${res.maskCount} 片`,
    `（總熱量需求 ${res.totalCalories} 大卡）`
  ].join('\n');
}

async function handleCopyShoppingList() {
  if (!lastCalcResult) return;
  const ok = await copyText(buildShoppingList(lastCalcResult));
  showToast(ok ? '採購清單已複製，可貼到記事本或通訊軟體' : '複製失敗，請手動記下結果');
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // 改用備援方式
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch (e) {
    return false;
  }
}

// Backup / Restore
function handleExportBackup() {
  const json = JSON.stringify(buildBackup(), null, 2);
  const filename = `survive_backup_${todayString().replace(/-/g, '')}.json`;
  downloadBlob(new Blob([json], { type: 'application/json' }), filename);
  showToast('備份檔已下載，內含個人聯絡資料，請妥善保存');
}

async function handleImportBackup(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  if (file.size > 1000000) {
    showToast('檔案過大，不是有效的備份檔');
    return;
  }

  try {
    const backup = JSON.parse(await file.text());
    if (!confirm('匯入會覆蓋目前的聯絡卡、點檢進度、效期與設定，確定要繼續嗎？')) return;
    restoreBackup(backup);
  } catch (err) {
    showToast(`匯入失敗：${err instanceof SyntaxError ? '檔案格式錯誤' : err.message}`);
    return;
  }

  applySettings();
  loadEmergencyMemoToForm();
  renderQuickDial();
  renderGuides();
  refreshChecklistNotices();
  showToast('備份資料已還原');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadSingleHtml() {
  // 優先取得原始 HTML（可由 SW 快取離線提供），避免匯出搜尋、勾選等執行期狀態
  let htmlContent;
  try {
    const res = await fetch(location.href.split('#')[0], { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    htmlContent = await res.text();
  } catch (e) {
    htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  }
  downloadBlob(new Blob([htmlContent], { type: 'text/html;charset=utf-8' }), 'survive_offline_manual.html');
}
