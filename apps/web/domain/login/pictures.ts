export const GLASS = "/img/background/glass.jpg";
const BIKE_TRACK_NIGHT = "/img/background/velo_parcours_nuit-scaled.jpg";
const BIKE_TRACK_DAY = "/img/background/velo_journee.jpg";
const SLACKLINE = "/img/background/slackline-scaled.jpg";
const SECU_TALKIE = "/img/background/secu_talkie-scaled.jpg";
const SWIM_CRAWL = "/img/background/natation_crawl-scaled.jpg";
const GROSALIE = "/img/background/grosalie-scaled.jpg";
const FIREWORKS = "/img/background/feux_artifice-scaled.jpg";
const DANCE_DAY = "/img/background/danse_journee.jpg";
const BARRIER_FEN = "/img/background/barrieres_fen-scaled.jpg";
const ACTIVITIES_DIRECTION_DAY = "/img/background/animation_journee_fleches.jpg";

const IMAGES = [
  GLASS,
  BIKE_TRACK_NIGHT,
  BIKE_TRACK_DAY,
  SLACKLINE,
  SECU_TALKIE,
  SWIM_CRAWL,
  GROSALIE,
  FIREWORKS,
  DANCE_DAY,
  BARRIER_FEN,
  ACTIVITIES_DIRECTION_DAY,
];

export function pickRandomBackground(excluded: string = ""): string {
  const remainingImages = IMAGES.filter((image) => image !== excluded);
  const randomIndex = Math.round(Math.random() * remainingImages.length);
  return remainingImages.at(randomIndex) ?? GLASS;
}
