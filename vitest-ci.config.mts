import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["verbose", "junit"],
    outputFile: { junit: "junit.xml" },
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "cobertura"],
      reportsDirectory: "coverage",
    },
  },
});
