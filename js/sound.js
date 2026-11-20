/**
 * NetQuest 16-Bit: 8-Bit Chiptune Synthesizer (Web Audio API)
 * Generates retro arcade SFX and optional toggleable 8-bit background melody.
 */
(function (global) {
  'use strict';

  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.bgmEnabled = false;
      this.bgmTimer = null;
      this.bgmStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    toggleSFX() {
      this.enabled = !this.enabled;
      if (this.enabled) this.playSelect();
      return this.enabled;
    }

    toggleBGM() {
      this.bgmEnabled = !this.bgmEnabled;
      if (this.bgmEnabled) {
        this.startBGM();
      } else {
        this.stopBGM();
      }
      return this.bgmEnabled;
    }

    tone(freq, duration, type = 'square', volume = 0.08, delay = 0, slideTo = null) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + duration);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    noise(duration = 0.1, volume = 0.07, delay = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      src.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(this.ctx.currentTime + delay);
    }

    playSelect() {
      this.tone(587.33, 0.06, 'square', 0.06);
      this.tone(880, 0.07, 'square', 0.05, 0.04);
    }

    playCoin() {
      this.tone(987.77, 0.07, 'square', 0.08, 0);
      this.tone(1318.51, 0.18, 'square', 0.08, 0.07);
    }

    playWireSnap() {
      this.tone(420, 0.05, 'triangle', 0.09, 0, 680);
    }

    playCrimp() {
      this.noise(0.09, 0.12, 0);
      this.tone(240, 0.08, 'sawtooth', 0.09, 0.02, 110);
      this.tone(520, 0.09, 'square', 0.06, 0.08);
    }

    playTesterBeep(pin) {
      const freq = 440 + pin * 65;
      this.tone(freq, 0.09, 'square', 0.06);
    }

    playLaserAttack() {
      this.tone(1100, 0.16, 'sawtooth', 0.07, 0, 220);
      this.tone(880, 0.14, 'square', 0.05, 0.04, 330);
    }

    playBossHit() {
      this.noise(0.14, 0.11, 0);
      this.tone(220, 0.15, 'square', 0.09, 0.02, 75);
      this.tone(660, 0.1, 'square', 0.06, 0.08);
    }

    playPlayerHurt() {
      this.tone(240, 0.12, 'sawtooth', 0.09, 0, 110);
      this.tone(160, 0.18, 'sawtooth', 0.09, 0.1, 80);
    }

    playPowerUp() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, idx) => this.tone(n, 0.09, 'square', 0.07, idx * 0.06));
    }

    playLevelUp() {
      const fanfare = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
      fanfare.forEach((n, idx) => {
        this.tone(n, idx === fanfare.length - 1 ? 0.35 : 0.1, 'square', 0.08, idx * 0.085);
      });
    }

    playVictoryFanfare() {
      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.5];
      const times = [0, 0.11, 0.22, 0.34, 0.48, 0.65, 0.78, 0.94];
      notes.forEach((n, idx) => {
        this.tone(n, idx === notes.length - 1 ? 0.45 : 0.11, 'square', 0.08, times[idx]);
      });
    }

    startBGM() {
      this.stopBGM();
      const melody = [
        329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63, 293.66,
        261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 392.0
      ];
      const bass = [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 196.0, 146.83];
      this.bgmTimer = setInterval(() => {
        if (!this.bgmEnabled || !this.enabled) return;
        const note = melody[this.bgmStep % melody.length];
        const bNote = bass[Math.floor(this.bgmStep / 2) % bass.length];
        this.tone(note, 0.14, 'square', 0.022, 0);
        if (this.bgmStep % 2 === 0) {
          this.tone(bNote, 0.24, 'triangle', 0.03, 0);
        }
        this.bgmStep++;
      }, 240);
    }

    stopBGM() {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  global.soundFX = new SoundManager();
})(window);
