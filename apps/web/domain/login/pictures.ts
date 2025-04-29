export const GLASS = "/img/glass.jpg";
export const ORGA_49 = "/img/orga-49.jpg";
const BIKE_TRACK_NIGHT =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/velo_parcours_nuit-scaled.jpg";
const BIKE_TRACK_DAY =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/velo_journee.jpg";
const SLACKLINE =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/slackline-scaled.jpg";
const SECU_TALKIE =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/secu_talkie-scaled.jpg";
const SWIM_CRAWL =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/natation_crawl-scaled.jpg";
const GROSALIE =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/grosalie-scaled.jpg";
const FIREWORKS =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/feux_artifice-scaled.jpg";
const DANCE_DAY =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/danse_journee.jpg";
const BARRIER_FEN =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/barrieres_fen-scaled.jpg";
const ACTIVITIES_DIRECTION_DAY =
  "https://wordpress.24heures.org/wp-content/uploads/2024/08/animation_journee_fleches.jpg";

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
