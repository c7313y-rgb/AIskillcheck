import { useContext } from "react";
import { DiagnosisContext, type DiagnosisContextValue } from "./diagnosisContextDefinition";

export function useDiagnosis(): DiagnosisContextValue {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) throw new Error("useDiagnosis must be used within DiagnosisProvider");
  return ctx;
}
