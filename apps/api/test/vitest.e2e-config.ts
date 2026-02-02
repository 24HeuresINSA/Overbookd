import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/vitest.e2e-setup.ts"],
    include: ["**/*.e2e-spec.ts"],
    reporters: ["verbose"],
    chaiConfig: { truncateThreshold: 0 },
  },
});
