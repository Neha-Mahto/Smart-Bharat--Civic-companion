// data/schemes.js
// A small curated dataset of well-known Indian government schemes/services.
// This is illustrative data for a hackathon demo — verify current details
// on official portals before using in a real deployment.

const schemes = [
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat (PM-JAY)",
    description:
      "Health insurance scheme providing coverage up to ₹5 lakh per family per year for secondary and tertiary hospitalization.",
    eligibility: "Economically vulnerable families as per SECC database.",
    requiredDocuments: [
      "Aadhaar card",
      "Ration card",
      "Income certificate",
    ],
    category: "health",
  },
  {
    id: "pm-awas-yojana",
    name: "PM Awas Yojana (PMAY)",
    description:
      "Housing scheme offering financial assistance and interest subsidy for building or buying a home.",
    eligibility:
      "Families without a pucca house, income criteria vary by category (EWS/LIG/MIG).",
    requiredDocuments: [
      "Aadhaar card",
      "Income certificate",
      "Property documents (if applicable)",
      "Bank account details",
    ],
    category: "housing",
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN",
    description:
      "Income support scheme providing ₹6,000 per year to eligible farmer families in three installments.",
    eligibility: "Small and marginal landholding farmer families.",
    requiredDocuments: [
      "Aadhaar card",
      "Land ownership documents",
      "Bank account details",
    ],
    category: "agriculture",
  },
  {
    id: "aadhaar-services",
    name: "Aadhaar Enrolment / Update",
    description:
      "Enrol for a new Aadhaar number or update existing details like address, mobile number, or biometrics.",
    eligibility: "All Indian residents.",
    requiredDocuments: [
      "Proof of identity",
      "Proof of address",
      "Proof of date of birth (for new enrolment)",
    ],
    category: "identity",
  },
  {
    id: "ration-card",
    name: "Ration Card",
    description:
      "Enables access to subsidized food grains through the Public Distribution System.",
    eligibility: "Indian residents, categorized by income (APL/BPL).",
    requiredDocuments: [
      "Aadhaar card",
      "Address proof",
      "Family photo",
      "Income certificate",
    ],
    category: "essentials",
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    description:
      "Savings scheme for the girl child offering attractive interest rates, aimed at funding education and marriage expenses.",
    eligibility: "Parents/guardians of a girl child below 10 years.",
    requiredDocuments: [
      "Girl child's birth certificate",
      "Aadhaar card of guardian",
      "Address proof",
    ],
    category: "savings",
  },
  {
    id: "pmuy",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    description:
      "Provides free LPG gas connections to women from economically weaker sections.",
    eligibility: "Women from BPL households without an existing LPG connection.",
    requiredDocuments: [
      "Aadhaar card",
      "BPL ration card",
      "Bank account details",
    ],
    category: "essentials",
  },
  {
    id: "pmegp",
    name: "PM Employment Generation Programme (PMEGP)",
    description:
      "Credit-linked subsidy scheme to support setting up new micro-enterprises for self-employment.",
    eligibility: "Individuals above 18 years, minimum education varies by project cost.",
    requiredDocuments: [
      "Aadhaar card",
      "Project report",
      "Educational certificates",
      "Caste certificate (if applicable)",
    ],
    category: "employment",
  },
];

export default schemes;
