/**
 * Shared domain types for the AI Skill Check diagnosis app.
 * These mirror the original script.js data shapes 1:1 to preserve behaviour.
 */

export type CategoryKey =
  | "literacy"
  | "prompt"
  | "business"
  | "data"
  | "automation"
  | "governance";

export interface Category {
  key: CategoryKey;
  label: string;
  color: string;
}

export type InterestKey =
  | "productivity"
  | "documents"
  | "dataDecision"
  | "revenue"
  | "implementation"
  | "development"
  | "agent"
  | "learning"
  | "governance";

export interface Interest {
  key: InterestKey;
  label: string;
  icon: string;
  targets: Partial<Record<CategoryKey, number>>;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  weights: Partial<Record<CategoryKey, number>>;
}

export type UserType = "adult" | "student";

export interface CourseBase {
  id: string;
  title: string;
  tag: string;
  image: string;
  categories: CategoryKey[];
  interests: InterestKey[];
  mode: string;
  hours: string;
  price: string;
  note: string;
}

export interface Package {
  id: string;
  title: string;
  courses: string[];
  price: string;
  hours: string;
  target: string;
  image: string;
}

export interface HomePreviewIds {
  student: string[];
  adult: string[];
}

export type StrengthCopy = Record<CategoryKey, string>;

export interface GoogleFormsEntries {
  name: string;
  email: string;
  organization: string;
  userType: string;
  totalScore: string;
  level: string;
  interests: string;
  recommendedCourses: string;
  learningMode: string;
  notes: string;
  diagnosisJson: string;
}

export interface GoogleFormsConfig {
  enabled: boolean;
  formActionUrl: string;
  entries: GoogleFormsEntries;
}
