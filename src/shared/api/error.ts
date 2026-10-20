import type { ApiErrorBody } from "./types";

const isErrorBody = (body: unknown): body is Pick<ApiErrorBody, "message"> =>
  typeof body === "object" &&
  body !== null &&
  "message" in body &&
  (typeof body.message === "string" || Array.isArray(body.message));

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  // Builds the error from whatever body the backend sent: the shared error
  // body when present, otherwise just the status.
  static from(body: unknown, status: number): ApiError {
    if (!isErrorBody(body)) {
      return new ApiError(status, `Request failed with status ${status}`);
    }

    const message = Array.isArray(body.message)
      ? body.message.join("; ")
      : body.message;

    return new ApiError(status, message);
  }
}
