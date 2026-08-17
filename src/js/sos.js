let audioCtx = null;
let sosInterval = null;
let isSosActive = false;
let torchTrack = null;

// Morse code timing (ms)
const DOT_DURATION = 150;
const DASH_DURATION = 450;
const PAUSE_DURATION = 150;
const LETTER_PAUSE = 450;
const CYCLE_PAUSE = 1500;

export function isSosRunning() {
  return isSosActive;
}

export async function startSosSignal({ onBlinkChange }) {
  if (isSosActive) return;
  isSosActive = true;

  // 初始化 Web Audio API
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  // 嘗試獲取手電筒控制權
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) {
        torchTrack = track;
      }
    }
  } catch (err) {
    // 忽略相機權限未獲取，退回使用螢幕閃爍
    torchTrack = null;
  }

  // 執行 SOS 循環
  runSosSequence(onBlinkChange);
}

export function stopSosSignal({ onBlinkChange }) {
  isSosActive = false;
  if (sosInterval) {
    clearTimeout(sosInterval);
    sosInterval = null;
  }
  if (torchTrack) {
    try {
      torchTrack.applyConstraints({ advanced: [{ torch: false }] });
      torchTrack.stop();
    } catch (e) {
      // ignore
    }
    torchTrack = null;
  }
  if (onBlinkChange) {
    onBlinkChange(false);
  }
}

function playBeep(duration) {
  if (!audioCtx || !isSosActive) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, audioCtx.currentTime); // 850Hz 穿透力高音
    
    gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration / 1000);
  } catch (e) {
    console.error('Audio error:', e);
  }
}

function setTorch(state) {
  if (torchTrack) {
    try {
      torchTrack.applyConstraints({ advanced: [{ torch: state }] });
    } catch (e) {}
  }
}

function delay(ms) {
  return new Promise(resolve => {
    sosInterval = setTimeout(resolve, ms);
  });
}

async function runSosSequence(onBlinkChange) {
  // SOS Morse Code: S (...) O (---) S (...)
  const pattern = [
    // S: . . .
    { type: 'dot' }, { type: 'dot' }, { type: 'dot' },
    { type: 'letter_pause' },
    // O: - - -
    { type: 'dash' }, { type: 'dash' }, { type: 'dash' },
    { type: 'letter_pause' },
    // S: . . .
    { type: 'dot' }, { type: 'dot' }, { type: 'dot' },
    { type: 'cycle_pause' }
  ];

  while (isSosActive) {
    for (const step of pattern) {
      if (!isSosActive) break;

      if (step.type === 'dot') {
        onBlinkChange(true);
        setTorch(true);
        playBeep(DOT_DURATION);
        await delay(DOT_DURATION);
        onBlinkChange(false);
        setTorch(false);
        await delay(PAUSE_DURATION);
      } else if (step.type === 'dash') {
        onBlinkChange(true);
        setTorch(true);
        playBeep(DASH_DURATION);
        await delay(DASH_DURATION);
        onBlinkChange(false);
        setTorch(false);
        await delay(PAUSE_DURATION);
      } else if (step.type === 'letter_pause') {
        await delay(LETTER_PAUSE);
      } else if (step.type === 'cycle_pause') {
        await delay(CYCLE_PAUSE);
      }
    }
  }
}
