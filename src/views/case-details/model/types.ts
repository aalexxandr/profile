export type CaseFactId = "company" | "period" | "role" | "team";

export type CaseFact = {
  id: CaseFactId;
  label: string;
  value: string;
};
