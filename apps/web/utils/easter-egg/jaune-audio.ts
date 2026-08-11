import type { RouteLocationNormalized } from "vue-router";
import { HOME_URL } from "@overbookd/web-page";

const JAUNE_AUDIO_KEY = "playJaune";

export function playJauneAudio() {
  const audio = new Audio("audio/jaune.m4a");
  audio.play();
}

export function playJauneAudioIfNeeded(to: RouteLocationNormalized) {
  if (to.path !== HOME_URL) return;

  const shouldPlay = localStorage.getItem(JAUNE_AUDIO_KEY);
  if (shouldPlay === "true") {
    localStorage.removeItem(JAUNE_AUDIO_KEY);
    playJauneAudio();
  }
}

export function planJauneAudioPlay() {
  localStorage.setItem(JAUNE_AUDIO_KEY, "true");
}
