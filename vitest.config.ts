import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["verbose"],
    chaiConfig: { truncateThreshold: 0 },
  },
});
