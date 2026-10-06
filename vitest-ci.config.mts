import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["verbose", "junit"],
    outputFile: "junit.xml",
    coverage: {
      provider: "v8",
    },
  },
});
