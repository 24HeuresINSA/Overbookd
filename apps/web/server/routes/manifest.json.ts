import { CETAITMIEUXAVANT, PREPROD } from "~/utils/navigation/url.constant";

export default defineEventHandler((event) => {
  const host = getRequestHost(event);

  let icon = "/favicon.ico";
  let name = "Overbookd";
  if (host.includes(PREPROD)) {
    icon = "/favicon-preprod.ico";
    name = "Overbookd Preprod";
  } else if (host.includes(CETAITMIEUXAVANT)) {
    icon = "/favicon-ctma.ico";
    name = "Overbookd CTMA";
  } else if (host.includes("localhost")) {
    name = "Overbookd Dev";
  }

  setHeader(event, "Content-Type", "application/manifest+json");
  return {
    name: name,
    short_name: name,
    description: "Organisation du festival des 24h de l’INSA",
    start_url: "/",
    lang: "fr",
    theme_color: "#41C5E5",
    display: "standalone",
    icons: [
      {
        src: icon,
        sizes: "192x192 512x512",
        type: "image/x-icon",
      },
    ],
  };
});
