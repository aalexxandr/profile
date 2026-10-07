import type { CaseShort } from "../model/case";

const STATUS_NUMBER_MIN = 2;
const STATUS_NUMBER_MAX = 1000;
const STATUS_NUMBER_RANGE = STATUS_NUMBER_MAX - STATUS_NUMBER_MIN + 1;

export const getStatusCount = (slug: CaseShort["slug"]) => {
  let hash = 0;

  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) % STATUS_NUMBER_RANGE;
  }

  return STATUS_NUMBER_MIN + hash;
};
