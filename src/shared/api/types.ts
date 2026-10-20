import type { components } from "./generated/schema";

export type Schemas = components["schemas"];
export type ApiErrorBody = Schemas["ErrorResponseDto"];
