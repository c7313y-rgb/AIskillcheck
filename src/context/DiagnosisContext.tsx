import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { diagnosisReducer, initialDiagnosisState } from "./diagnosisReducer";
import { DiagnosisContext } from "./diagnosisContextDefinition";
import { QUESTIONS } from "../data/questions";
import type { DiagnosisState } from "./diagnosisReducer";

const DRAFT_KEY = "aiSkillDiagnosisDraft";

interface StoredDraft {
  userType?: DiagnosisState["form"]["userType"];
  personName?: string;
  organization?: string;
  currentRole?: string;
  baseIncome?: string;
  interests?: string[];
  answers?: Record<string, number | null>;
}

function loadDraft(): StoredDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDraft;
  } catch (error) {
    console.warn("draft restore failed", error);
    return null;
  }
}

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(diagnosisReducer, initialDiagnosisState);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const draft = loadDraft();
    if (!draft) return;
    const answers: Record<string, number> = {};
    if (draft.answers) {
      QUESTIONS.forEach((question) => {
        const value = draft.answers?.[question.id];
        if (value != null) answers[question.id] = value;
      });
    }
    dispatch({
      type: "HYDRATE_FORM",
      form: {
        userType: draft.userType ?? "adult",
        personName: draft.personName ?? "",
        organization: draft.organization ?? "",
        currentRole: draft.currentRole ?? "経営・事業責任者",
        baseIncome: draft.baseIncome ?? "",
        interests: (draft.interests as never) ?? [],
        answers,
      },
    });
    dispatch({ type: "SET_DRAFT_STATUS", status: "前回の入力を復元しました" });
  }, []);

  function saveDraft(silent = true) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state.form));
    const status = `保存済み ${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`;
    dispatch({ type: "SET_DRAFT_STATUS", status });
    void silent;
  }

  return <DiagnosisContext.Provider value={{ state, dispatch, saveDraft }}>{children}</DiagnosisContext.Provider>;
}
