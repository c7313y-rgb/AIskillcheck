import type { GoogleFormsConfig } from "./types";

/**
 * Google Forms integration config.
 * Disabled by default — see GOOGLE_FORMS_SETUP.md for activation steps.
 */
export const GOOGLE_FORMS_CONFIG: GoogleFormsConfig = {
  enabled: false,
  formActionUrl: "",
  entries: {
    name: "entry.0000000001",
    email: "entry.0000000002",
    organization: "entry.0000000003",
    userType: "entry.0000000004",
    totalScore: "entry.0000000005",
    level: "entry.0000000006",
    interests: "entry.0000000007",
    recommendedCourses: "entry.0000000008",
    learningMode: "entry.0000000009",
    notes: "entry.0000000010",
    diagnosisJson: "entry.0000000011",
  },
};
