import { MAX_FIELD_LENGTH, MAX_MESSAGE_LENGTH } from "../config";
import type { ContactFieldName } from "../model/types";

export const getFieldLimit = (field: ContactFieldName) =>
  field === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH;
