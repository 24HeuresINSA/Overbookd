import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    reporters: ["verbose", "junit"],
    outputFile: "junit.xml",
    coverage: {
      provider: "v8",
    },
  },
});
