import path from "path";
import type { PrismaConfig } from "prisma";

export default {
  earlyAccess: true,
  schema: path.join(__dirname, "prisma/schema.prisma"),
} satisfies PrismaConfig;
