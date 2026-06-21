import type { InterestKey, UserType } from "../data/types";
import type { Answers } from "../lib/scoring";
import type { DiagnosisResult } from "../lib/diagnosis";

export interface DiagnosisFormState {
  userType: UserType;
  personName: string;
  organization: string;
  currentRole: string;
  baseIncome: string;
  interests: InterestKey[];
  answers: Answers;
}

export interface DiagnosisState {
  form: DiagnosisFormState;
  result: DiagnosisResult | null;
  draftStatus: string;
  questionFilter: string;
  previewAudience: "student" | "adult";
}

export const DEFAULT_ROLE = "経営・事業責任者";

export const INITIAL_FORM_STATE: DiagnosisFormState = {
  userType: "adult",
  personName: "",
  organization: "",
  currentRole: DEFAULT_ROLE,
  baseIncome: "",
  interests: [],
  answers: {},
};

export const initialDiagnosisState: DiagnosisState = {
  form: INITIAL_FORM_STATE,
  result: null,
  draftStatus: "未保存",
  questionFilter: "all",
  previewAudience: "student",
};

export type DiagnosisAction =
  | { type: "SET_USER_TYPE"; userType: UserType }
  | { type: "SET_FIELD"; field: "personName" | "organization" | "currentRole" | "baseIncome"; value: string }
  | { type: "TOGGLE_INTEREST"; interest: InterestKey }
  | { type: "SET_ANSWER"; questionId: string; value: number }
  | { type: "SET_QUESTION_FILTER"; filter: string }
  | { type: "SET_PREVIEW_AUDIENCE"; audience: "student" | "adult" }
  | { type: "SET_RESULT"; result: DiagnosisResult }
  | { type: "SET_DRAFT_STATUS"; status: string }
  | { type: "HYDRATE_FORM"; form: Partial<DiagnosisFormState> }
  | { type: "RESET" };

export function diagnosisReducer(state: DiagnosisState, action: DiagnosisAction): DiagnosisState {
  switch (action.type) {
    case "SET_USER_TYPE":
      return { ...state, form: { ...state.form, userType: action.userType } };
    case "SET_FIELD":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "TOGGLE_INTEREST": {
      const exists = state.form.interests.includes(action.interest);
      const interests = exists
        ? state.form.interests.filter((key) => key !== action.interest)
        : [...state.form.interests, action.interest];
      return { ...state, form: { ...state.form, interests } };
    }
    case "SET_ANSWER":
      return {
        ...state,
        form: { ...state.form, answers: { ...state.form.answers, [action.questionId]: action.value } },
      };
    case "SET_QUESTION_FILTER":
      return { ...state, questionFilter: action.filter };
    case "SET_PREVIEW_AUDIENCE":
      return { ...state, previewAudience: action.audience };
    case "SET_RESULT":
      return { ...state, result: action.result };
    case "SET_DRAFT_STATUS":
      return { ...state, draftStatus: action.status };
    case "HYDRATE_FORM":
      return { ...state, form: { ...state.form, ...action.form } };
    case "RESET":
      return initialDiagnosisState;
    default:
      return state;
  }
}
