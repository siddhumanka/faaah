let audioInstance: HTMLAudioElement | null = null;
let isMuted = false;

export const initAudio = () => {
  if (typeof window === 'undefined') return;
  if (!audioInstance) {
    audioInstance = new Audio('/sounds/fahh.mp3');
    audioInstance.preload = 'auto';
  }
  const stored = localStorage.getItem('faaah-muted');
  if (stored) isMuted = JSON.parse(stored);
};

export const playFaaahSound = async () => {
  if (isMuted) return;
  try {
    if (!audioInstance) initAudio();
    if (!audioInstance) return;
    audioInstance.currentTime = 0;
    await audioInstance.play();
  } catch (error) {
    console.log('Audio play failed:', error);
  }
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('faaah-muted', JSON.stringify(muted));
  }
};

export const getMuted = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('faaah-muted');
    if (stored) isMuted = JSON.parse(stored);
  }
  return isMuted;
};
