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
  "Jhang",
  "Sheikhupura",
  "Gujrat",
  "Sukkur",
  "Sahiwal",
  "Larkana",
  "Other",
] as const;

export type City = (typeof CITIES)[number];


export const AREAS_BY_CITY: Record<string, string[]> = {
  Lahore: [
    // Central
    "Gulberg", "Model Town", "Garden Town", "Shadman", "Mozang", "Ichhra",
    "Cavalry Ground", "Cantt", "Muslim Town", "Mall Road / Anarkali",
    "New Garden Town", "Garhi Shahu",
    // North
    "Shahdara", "Shalimar Town", "Ravi Road", "Badami Bagh",
    "Old City / Walled City", "Samanabad", "Gulshan-e-Ravi", "Green Town",
    // East / Central-East
    "Allama Iqbal Town", "Iqbal Town", "Faisal Town", "Mustafa Town",
    // South-East
    "Johar Town", "Wapda Town", "Punjab University Society",
    "Paragon City", "Lake City", "Valencia Town",
    // DHA Belt
    "DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "DHA Phase 4",
    "DHA Phase 5", "DHA Phase 6", "DHA Phase 7", "DHA Phase 8", "DHA Phase 9",
    "Askari", "Bahria Town",
    // West / South-West
    "Township", "Kot Lakhpat", "EME Colony",
    // South
    "Thokar Niaz Baig", "Wahdat Road", "Raiwind Road",
  ],

  Karachi: [
    // Defence / Clifton (South)
    "Clifton", "Bath Island", "Zamzama", "Badar Commercial",
    "DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "DHA Phase 4",
    "DHA Phase 5", "DHA Phase 6", "DHA Phase 7", "DHA Phase 8",
    // Central
    "PECHS", "Bahadurabad", "Sindhi Muslim Society", "Tariq Road",
    "Shahrah-e-Faisal", "PIB Colony", "Rashid Minhas Road",
    // Gulshan / Johar Belt
    "Gulshan-e-Iqbal", "Gulistan-e-Johar", "Safoora Goth", "Scheme 33",
    "University Road", "Stadium Road",
    // North Karachi
    "North Nazimabad", "Federal B Area", "Nazimabad", "Karimabad",
    "Liaquatabad", "Paposh Nagar", "New Karachi", "Surjani Town",
    "Buffer Zone",
    // Old / Saddar
    "Saddar", "Garden", "Frere Town", "Lyari", "Keamari", "Lines Area",
    // East
    "Malir", "Malir Cantt", "Shah Faisal Colony", "Model Colony",
    "Landhi", "Korangi",
    // West
    "Orangi Town", "Baldia Town", "SITE Area", "Gulberg Town",
  ],

  Islamabad: [
    // F Sectors
    "F-6", "F-7", "F-8", "F-10", "F-11",
    // G Sectors
    "G-6", "G-7", "G-8", "G-9", "G-10", "G-11", "G-13", "G-14", "G-15",
    // H Sectors
    "H-8", "H-9", "H-10", "H-11", "H-13",
    // I Sectors
    "I-8", "I-9", "I-10",
    // E Sectors
    "E-7", "E-8", "E-9", "E-11",
    // D / B Sectors
    "D-12", "D-17", "B-17",
    // Housing Schemes
    "Bahria Town Islamabad", "DHA Islamabad", "Park Enclave",
    "Faisal Hills", "Top City",
    // Older / Other Areas
    "Pakistan Town", "Ghori Town", "Korang Town",
    "Bani Gala", "Saidpur", "Margalla Town",
  ],

  Rawalpindi: [
    // Central / Saddar
    "Saddar", "Cantt", "Liaquat Bagh", "Raja Bazaar",
    // Main Housing Schemes
    "Satellite Town", "Westridge", "Gulraiz Housing Scheme",
    "Chaklala Scheme 3", "Allama Iqbal Colony",
    // Askari
    "Askari 1", "Askari 2", "Askari 10", "Askari 14",
    // Bahria Town Rawalpindi
    "Bahria Town Phase 1", "Bahria Town Phase 2", "Bahria Town Phase 4",
    "Bahria Town Phase 7", "Bahria Town Phase 8",
    // Old / Inner Areas
    "Pir Wadhai", "Dheri Hassanabad", "Lal Kurti",
    "Tench Bhata", "Gulshar Colony",
    // Road Corridors
    "Murree Road", "Peshawar Road", "Adiala Road",
    "Airport Road", "Haider Road",
    // Outskirts
    "Rawat", "Taxila", "Chakri Road",
  ],

  Faisalabad: [
    // Central / Commercial
    "Clock Tower", "Civil Lines", "Kotwali Road", "Railway Road",
    // Major Colonies
    "Peoples Colony", "Gulberg", "Madina Town", "Millat Town",
    "Batala Colony", "Ghulam Muhammad Abad", "Jinnah Colony",
    "Samanabad", "National Town", "Mansoorabad",
    "Usman Town", "Nishat Colony", "Lyallpur Town",
    // Road Corridors
    "Susan Road", "Canal Road", "Sitiana Road",
    "Sargodha Road", "Sammundri Road", "Jhang Road", "Dijkot Road",
    // Nearby Towns
    "Chak Jhumra", "Tandlianwala",
  ],
};


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
  STEP: 500,
} as const;
