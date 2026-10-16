import { acquireTorch, setTorch, releaseTorch } from './torch.js';

let lightMode = null; // 'torch' | 'screen' | null
let wakeLock = null;

export function getLightMode() {
  return lightMode;
}

// 開啟背面閃光燈常亮；裝置不支援時回傳 null
export async function startFlashlight() {
  const ok = await acquireTorch();
  if (!ok) return null;
  setTorch(true);
  lightMode = 'torch';
  return lightMode;
}

// 全螢幕白光模式：畫面由呼叫端負責，這裡只處理防止螢幕休眠
export function startScreenLight() {
  lightMode = 'screen';
  requestWakeLock();
}

export function stopLight() {
  if (lightMode === 'torch') releaseTorch();
  if (lightMode === 'screen') releaseWakeLock();
  lightMode = null;
}

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    const lock = await navigator.wakeLock.request('screen');
    if (lightMode === 'screen') {
      wakeLock = lock;
    } else {
      lock.release().catch(() => {});
    }
  } catch (e) {
    wakeLock = null;
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}
