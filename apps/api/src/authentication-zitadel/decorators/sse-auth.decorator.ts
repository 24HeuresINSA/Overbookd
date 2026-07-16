import { SetMetadata } from "@nestjs/common";

export const SSE_KEY = "sse";

export const SseAuth = () => SetMetadata(SSE_KEY, true);
