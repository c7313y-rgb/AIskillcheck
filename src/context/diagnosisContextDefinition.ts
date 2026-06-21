import { createContext } from "react";
import type { DiagnosisAction, DiagnosisState } from "./diagnosisReducer";

export interface DiagnosisContextValue {
  state: DiagnosisState;
  dispatch: React.Dispatch<DiagnosisAction>;
  saveDraft: (silent?: boolean) => void;
}

export const DiagnosisContext = createContext<DiagnosisContextValue | null>(null);
