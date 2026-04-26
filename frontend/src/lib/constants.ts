// UstaadPK — Shared Constants
// All constants from Section 4 of the implementation plan

// ─── Teaching Levels ─────────────────────────────────────────────────────────

export const TEACHING_LEVELS = [
  "Primary / Middle (Class 1–8)",
  "Matric (Class 9–10 / SSC)",
  "FSc / ICS / ICom (Class 11–12 / HSSC)",
  "O-Level",
  "A-Level",
  "Entry Test Prep (MDCAT)",
  "Entry Test Prep (ECAT)",
] as const;

export type TeachingLevel = (typeof TEACHING_LEVELS)[number];

// ─── Subjects by Level ───────────────────────────────────────────────────────
//
// Each level maps to a grouped subject list.
// Skills are level-agnostic — shown as a separate group regardless of level.
// Use getSubjectsForLevel(level) in the UI instead of the raw SUBJECTS map.

export const SUBJECTS_BY_LEVEL: Record<
  TeachingLevel,
  Record<string, string[]>
> = {
  "Primary / Middle (Class 1–8)": {
    Sciences: ["Mathematics", "Science"],
    Languages: ["English", "Urdu"],
    Humanities: ["Social Studies", "Islamiat", "History", "Geography"],
    Computing: ["Computer Science / ICT"],
    Other: ["Other"],
  },

  "Matric (Class 9–10 / SSC)": {
    Sciences: [
      "Physics",
      "Chemistry",
      "Biology",
      "Mathematics",
      "Computer Science",
    ],
    Commerce: ["Accounting", "Economics", "Business Studies", "Commerce"],
    Languages: ["English", "Urdu"],
    Humanities: ["Pakistan Studies", "Islamiat", "Civics", "General Science"],
    Other: ["Other"],
  },

  "FSc / ICS / ICom (Class 11–12 / HSSC)": {
    // FSc Pre-Medical / Pre-Engineering / ICS / ICom covered here
    Sciences: [
      "Physics",
      "Chemistry",
      "Biology",
      "Mathematics",
      "Statistics",
      "Computer Science",
    ],
    Commerce: ["Principles of Accounting", "Principles of Economics", "Principles of Commerce", "Business Mathematics", "Business Statistics"],
    Languages: ["English", "Urdu"],
    Humanities: ["Pakistan Studies", "Islamiat", "Civics", "History", "Geography", "Philosophy", "Fine Arts", "English Literature"],
    Other: ["Other"],
  },

  "O-Level": {
    Sciences: [
      "Physics",
      "Chemistry",
      "Biology",
      "Mathematics",
      "Additional Mathematics",
      "Computer Science",
      "ICT",
    ],
    Commerce: ["Accounting", "Economics", "Business Studies", "Commerce"],
    Languages: ["English Language", "Urdu First Language", "Urdu Second Language"],
    Humanities: [
      "Pakistan Studies",
      "Islamiyat",
      "History",
      "Geography",
      "Sociology",
      "Art & Design",
      "Environmental Management",
      "Global Perspectives & Research",
      "Literature in English"
    ],
    Other: ["Other"],
  },

  "A-Level": {
    Sciences: [
      "Physics",
      "Chemistry",
      "Biology",
      "Mathematics",
      "Further Mathematics",
      "Computer Science",
      "IT",
    ],
    Commerce: ["Accounting", "Economics", "Business Studies"],
    Languages: ["English Language", "Urdu"],
    Humanities: [
      "English Literature",
      "History",
      "Psychology",
      "Sociology",
      "Law",
      "Art and Design",
      "Environmental Management",
      "Thinking Skills",
      "Global Perspectives & Research",
      "Islamic Studies"
    ],
    Other: ["Other"],
  },

  "Entry Test Prep (MDCAT)": {
    Sciences: ["Biology", "Chemistry", "Physics"],
    Languages: ["English"],
    Other: ["Other"],
  },

  "Entry Test Prep (ECAT)": {
    Sciences: ["Mathematics", "Physics", "Chemistry"],
    Languages: ["English"],
    Other: ["Other"],
  },
};

// ─── Skills (Level-Agnostic) ─────────────────────────────────────────────────
//
// These subjects are NOT tied to any board curriculum.
// Show them as an always-available group alongside any level selection.
// Tutors teaching "Python" or "Web Dev" appeal to all age groups.

export const SKILLS_SUBJECTS = [
  "Web Development",
  "Python",
  "Graphic Design",
  "Digital Marketing",
] as const;

// ─── Helper: Get subjects for a given level ───────────────────────────────────
//
// Returns grouped subjects for a specific level, with Skills always appended.
// Usage in SubjectSelector: getSubjectsForLevel(selectedLevel)

export function getSubjectsForLevel(
  level: TeachingLevel
): Record<string, string[]> {
  const levelSubjects = SUBJECTS_BY_LEVEL[level] ?? {};
  return {
    ...levelSubjects,
    "Skills & Coding": [...SKILLS_SUBJECTS],
  };
}

// ─── Helper: Get flat subject list for a level (for search dropdowns) ─────────

export function getFlatSubjectsForLevel(level: TeachingLevel): string[] {
  const grouped = getSubjectsForLevel(level);
  return Object.values(grouped).flat();
}

// ─── All unique subjects (for search filter when no level is selected) ─────────

export const ALL_SUBJECTS: string[] = [
  ...new Set([
    ...Object.values(SUBJECTS_BY_LEVEL)
      .flatMap((groups) => Object.values(groups).flat()),
    ...SKILLS_SUBJECTS,
  ]),
].sort();

// ─── Cities ───────────────────────────────────────────────────────────────────

export const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Other",
] as const;

export type City = (typeof CITIES)[number];

// ─── Teaching Modes ───────────────────────────────────────────────────────────

export const TEACHING_MODES = [
  "Home Visit (Tutor travels to student)",
  "Home-Based (Student comes to tutor)",
  "Online",
  "Academy/Center",
] as const;

export type TeachingMode = (typeof TEACHING_MODES)[number];

// ─── Languages of Instruction ─────────────────────────────────────────────────

export const LANGUAGES_OF_INSTRUCTION = ["Urdu", "English", "Both"] as const;

// ─── WhatsApp pre-filled message ──────────────────────────────────────────────

export const WHATSAPP_MESSAGE =
  "Assalam o Alaikum! I found your profile on UstaadPK and I'm interested in tuition. Can we discuss further?";

// ─── Rate range limits (PKR/month) ───────────────────────────────────────────

export const RATE_RANGE = {
  MIN: 1000,
  MAX: 50000,
  STEP: 500,
} as const;
