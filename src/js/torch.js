// 手機背面閃光燈控制（SOS 與手電筒共用）
let torchTrack = null;

export async function acquireTorch() {
  if (torchTrack) return true;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    const track = stream.getVideoTracks()[0];
    const capabilities = track && track.getCapabilities ? track.getCapabilities() : {};
    if (capabilities.torch) {
      torchTrack = track;
      return true;
    }
    // 不支援閃光燈時立即關閉相機，避免相機持續佔用
    stream.getTracks().forEach(t => t.stop());
  } catch (err) {
    // 未取得相機權限
  }
  return false;
}

export function setTorch(on) {
  if (!torchTrack) return;
  try {
    torchTrack.applyConstraints({ advanced: [{ torch: on }] }).catch(() => {});
  } catch (e) {
    // ignore
  }
}

export function releaseTorch() {
  if (!torchTrack) return;
  setTorch(false);
  try {
    torchTrack.stop();
  } catch (e) {
    // ignore
  }
  torchTrack = null;
}
