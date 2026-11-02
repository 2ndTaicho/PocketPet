let audioContext;

export function playGameSound(kind, settings) {
  if (!settings.sound || settings.volume <= 0) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const notes = {
      click: [[550, 0], [730, 0.08]],
      feed: [[440, 0], [660, 0.1]],
      rest: [[620, 0], [440, 0.13]],
      bath: [[550, 0], [820, 0.12]],
      pet: [[680, 0]],
      reward: [[523, 0], [659, 0.12], [784, 0.24]],
      play: [[480, 0], [720, 0.12]]
    };

    const sequence = notes[kind] || notes.click;
    const start = audioContext.currentTime;

    sequence.forEach(([frequency, offset]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        frequency,
        start + offset
      );

      gain.gain.setValueAtTime(
        0.0001,
        start + offset
      );

      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, settings.volume / 100 * 0.11),
        start + offset + 0.012
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + offset + 0.18
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.2);
    });
  } catch {}
}
