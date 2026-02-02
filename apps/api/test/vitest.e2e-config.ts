import { defineConfig } from "vitest/config";

const isCI = process.env.CI === "true";

export default defineConfig({
  test: {
    setupFiles: ["./test/vitest.e2e-setup.ts"],
    include: ["**/*.e2e-spec.ts"],
    reporters: isCI ? ["verbose", "junit"] : ["verbose"],
    outputFile: isCI ? "junit.xml" : undefined,
    coverage: isCI
      ? { provider: "v8" }
      : undefined,
  },
});
