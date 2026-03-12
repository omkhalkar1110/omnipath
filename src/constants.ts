import { College } from "./types";

export const REGION_CLUSTERS: Record<string, string[]> = {
  "mumbai": ["mumbai", "navi mumbai", "thane", "kalyan", "dombivli", "ulhasnagar", "vasai", "virar", "mira bhayandar"],
  "pune": ["pune", "pimpri chinchwad", "akurdi", "hadapsar", "hinjewadi", "baner", "kothrud", "wakad"],
  "nagpur": ["nagpur", "wardha", "bhandara", "gondia"],
  "nashik": ["nashik", "chandwad", "malegaon", "niphad"],
  "aurangabad": ["aurangabad", "chhatrapati sambhajinagar", "jalna", "beed"],
  "amravati": ["amravati", "akola", "washim", "buldhana", "yavatmal"],
  "kolhapur": ["kolhapur", "sangli", "satara", "karad", "ichalkaranji", "jaysingpur"],
  "konkan": ["ratnagiri", "sindhudurg", "raigad", "chiplun", "khed"]
};

export const CATEGORIES = [
  "Open",
  "OBC",
  "SC",
  "ST",
  "VJ/DT (NT-A)",
  "NT-B",
  "NT-C",
  "NT-D",
  "SBC",
  "EWS",
  "SEBC"
];

export const ENGINEERING_BRANCHES = [
  "Computer Science",
  "IT",
  "AI & ML",
  "Mechanical",
  "Civil",
  "Electronics",
  "Electrical",
  "Chemical",
  "Data Science",
  "Robotics"
];

export const MEDICAL_BRANCHES = [
  "MBBS",
  "BDS",
  "BAMS",
  "BHMS",
  "BUMS",
  "BPTh (Physiotherapy)",
  "BASLP",
  "B.Sc Nursing",
  "BVSc & AH"
];

export const COMMERCE_BRANCHES = [
  "B.Com (General)",
  "B.Com (Accounting & Finance)",
  "B.Com (Banking & Insurance)",
  "BMS (Management Studies)",
  "BBA (Business Administration)",
  "BMM (Mass Media)",
  "CA Foundation",
  "CS Executive Entrance",
  "CMA Foundation",
  "B.Voc (Retail Management)"
];

export const CAREER_ROADMAPS: Record<string, { title: string, options: { name: string, path: string, intelligence: string }[] }> = {
  engineering: {
    title: "Engineering & Tech Roadmap",
    options: [
      { name: "Core Engineering", path: "B.E / B.Tech (Mech, Civil, Elec)", intelligence: "Best for students who love physical systems and infrastructure." },
      { name: "Software & AI", path: "B.E / B.Tech (CS, IT, AI/ML)", intelligence: "Ideal for logical thinkers and those interested in the digital future." },
      { name: "Design & Architecture", path: "B.Arch", intelligence: "For creative minds with a sense of space and structure." },
      { name: "Pure Sciences", path: "B.Sc / M.Sc (Research)", intelligence: "For those with deep curiosity about how the universe works." }
    ]
  },
  medical: {
    title: "Medical & Healthcare Roadmap",
    options: [
      { name: "Clinical Medicine", path: "MBBS", intelligence: "The gold standard for those dedicated to patient care and surgery." },
      { name: "Dental Surgery", path: "BDS", intelligence: "For students interested in specialized clinical practice." },
      { name: "Alternative Medicine", path: "BAMS / BHMS", intelligence: "For those interested in holistic and traditional healing." },
      { name: "Allied Health", path: "Physiotherapy / Nursing", intelligence: "Critical support roles with high demand and patient interaction." }
    ]
  },
  commerce: {
    title: "Commerce & Finance Roadmap",
    options: [
      { name: "Professional Accounting", path: "CA / CS / CMA", intelligence: "For highly disciplined students who excel in law and auditing. No specific entrance for college, but professional exams are key." },
      { name: "Management (Entrance)", path: "BMS / BBA (MAH-CET / NPAT / SET)", intelligence: "Ideal for leadership-oriented students. Take MAH-BMS-CET for Maharashtra colleges or NPAT for NMIMS." },
      { name: "Elite Management", path: "IPM (IPMAT)", intelligence: "For the top 1% who want to enter IIMs directly after 12th. Requires high quantitative and verbal aptitude." },
      { name: "Central Universities", path: "B.Com Hons (CUET)", intelligence: "Target SRCC or Hindu College. Requires strong domain knowledge in Accountancy and Economics." }
    ]
  },
  polytechnic: {
    title: "Diploma & Skill-Based Roadmap",
    options: [
      { name: "Technical Diploma", path: "Diploma in Engg", intelligence: "Quick entry into the workforce with hands-on technical skills." },
      { name: "Lateral Entry", path: "Direct 2nd Year B.E", intelligence: "A great path to a degree for those who prefer practical learning first." },
      { name: "Vocational Training", path: "ITI / B.Voc", intelligence: "Focused on specific industry trades and immediate employability." }
    ]
  }
};

export const CATEGORY_REQUIREMENTS: Record<string, { documents: string[], benefits: string, scholarship: string }> = {
  "Open": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Nationality Certificate"],
    benefits: "General merit-based admission.",
    scholarship: "EBC (Rajarshi Shahu Maharaj) scholarship available if family income < 8 Lakhs."
  },
  "OBC": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate", "Non-Creamy Layer Certificate (Valid)"],
    benefits: "27% reservation in state government colleges.",
    scholarship: "Post-Matric Scholarship for OBC students."
  },
  "SC": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate"],
    benefits: "13% reservation in state government colleges.",
    scholarship: "100% tuition fee waiver for government and aided colleges."
  },
  "ST": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate"],
    benefits: "7% reservation in state government colleges.",
    scholarship: "100% tuition fee waiver for government and aided colleges."
  },
  "VJ/DT (NT-A)": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate", "Non-Creamy Layer Certificate"],
    benefits: "3% reservation in state government colleges.",
    scholarship: "Vimukta Jati Post-Matric Scholarship."
  },
  "NT-B": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate", "Non-Creamy Layer Certificate"],
    benefits: "2.5% reservation in state government colleges.",
    scholarship: "Nomadic Tribe Post-Matric Scholarship."
  },
  "NT-C": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate", "Non-Creamy Layer Certificate"],
    benefits: "3.5% reservation in state government colleges.",
    scholarship: "Nomadic Tribe Post-Matric Scholarship."
  },
  "NT-D": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate", "Non-Creamy Layer Certificate"],
    benefits: "2% reservation in state government colleges.",
    scholarship: "Nomadic Tribe Post-Matric Scholarship."
  },
  "SBC": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "Caste Certificate", "Caste Validity Certificate", "Non-Creamy Layer Certificate"],
    benefits: "2% reservation (Special Backward Class).",
    scholarship: "SBC Post-Matric Scholarship."
  },
  "EWS": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "EWS Certificate (Current Year)"],
    benefits: "10% reservation for Economically Weaker Sections.",
    scholarship: "Fee concessions as per government norms."
  },
  "SEBC": {
    documents: ["10th & 12th Marksheets", "Leaving Certificate", "Domicile Certificate", "SEBC Caste Certificate", "Non-Creamy Layer Certificate"],
    benefits: "Reservation as per latest state government amendments.",
    scholarship: "State government scholarship schemes for SEBC."
  }
};

export const CAP_ROUND_GUIDE = [
  {
    title: "Registration & Verification",
    description: "The first step is online registration on the official CET Cell website. You must upload required documents (Mark sheets, Category certificates, etc.) and get them verified at a Facilitation Centre (FC) or via e-Scrutiny.",
    step: 1
  },
  {
    title: "Provisional & Final Merit List",
    description: "After verification, a provisional merit list is released. You can raise grievances if there are errors. Finally, the Final Merit List is published, which determines your rank for admissions.",
    step: 2
  },
  {
    title: "Option Form Filling (CAP Round 1)",
    description: "This is the most critical stage. You must fill in your preferences of colleges and branches. Be careful with the order, as the system allocates the highest possible preference based on your rank.",
    step: 3
  },
  {
    title: "Seat Allotment & Freeze/Float",
    description: "If a seat is allotted, you have three choices: \n1. Freeze: You are satisfied and want to take the seat. \n2. Float: You accept the seat but want to try for a better preference in the next round. \n3. Slide: You accept the seat but want a better branch in the same college.",
    step: 4
  },
  {
    title: "Reporting to Institute",
    description: "Once you 'Freeze' a seat, you must pay the seat acceptance fee online and report to the allotted institute with original documents to confirm your admission.",
    step: 5
  }
];

export const NATIONAL_COLLEGE_DB: College[] = [
  { 
    name: "IIT Bombay", 
    tier: "Elite", 
    type: "Engineering", 
    exam: "JEE Advanced", 
    level: "National",
    cutoff: 99.9, 
    jeeCutoff: 99.9,
    jeeAdvancedCutoff: 99.9,
    branches: ["Computer Science", "Electrical", "Mechanical", "Aerospace", "Chemical"],
    regions: ["Mumbai"],
    website: "https://www.iitb.ac.in",
    description: "The premier engineering institute of India, known for its world-class research and placements.",
    placements: {
      avgPackage: "25.8 LPA",
      highestPackage: "1.64 CPA",
      recruiters: ["Google", "Microsoft", "Apple", "Uber", "Goldman Sachs"]
    }
  },
  { 
    name: "IIT Delhi", 
    tier: "Elite", 
    type: "Engineering", 
    exam: "JEE Advanced", 
    level: "National",
    cutoff: 99.8, 
    jeeCutoff: 99.8,
    jeeAdvancedCutoff: 99.8,
    branches: ["Computer Science", "Mathematics & Computing", "Electrical", "Mechanical"],
    regions: ["Delhi"],
    website: "https://home.iitd.ac.in",
    description: "One of the oldest and most prestigious IITs, located in the capital city.",
    placements: {
      avgPackage: "23.5 LPA",
      highestPackage: "1.5 CPA",
      recruiters: ["Google", "Amazon", "Facebook", "Microsoft"]
    }
  },
  { 
    name: "NIT Trichy", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    level: "National",
    cutoff: 99.2, 
    jeeCutoff: 99.2,
    branches: ["Computer Science", "ECE", "EEE", "Mechanical"],
    regions: ["Tamil Nadu"],
    website: "https://www.nitt.edu",
    description: "Consistently ranked as the top NIT in India.",
    placements: {
      avgPackage: "15.0 LPA",
      highestPackage: "45.0 LPA",
      recruiters: ["Nvidia", "Qualcomm", "Texas Instruments", "Oracle"]
    }
  },
  { 
    name: "NIT Surathkal", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    level: "National",
    cutoff: 99.0, 
    jeeCutoff: 99.0,
    branches: ["Computer Science", "IT", "Electronics", "Mechanical"],
    regions: ["Karnataka"],
    website: "https://www.nitk.ac.in",
    description: "Top NIT known for its beautiful campus and excellent placements.",
    placements: {
      avgPackage: "14.5 LPA",
      highestPackage: "51.0 LPA",
      recruiters: ["Microsoft", "Amazon", "Adobe", "Intuit"]
    }
  },
  { 
    name: "IIIT Hyderabad", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    level: "National",
    cutoff: 99.5, 
    jeeCutoff: 99.5,
    branches: ["Computer Science", "Electronics & Communication"],
    regions: ["Telangana"],
    website: "https://www.iiit.ac.in",
    description: "A premier research university for computer science and electronics.",
    placements: {
      avgPackage: "30.0 LPA",
      highestPackage: "74.0 LPA",
      recruiters: ["Google", "Facebook", "Microsoft", "Bloomberg"]
    }
  },
  { 
    name: "BITS Pilani", 
    tier: "Elite", 
    type: "Engineering", 
    exam: "BITSAT", 
    level: "National",
    cutoff: 320, 
    branches: ["Computer Science", "Electronics", "Mechanical", "Chemical"],
    regions: ["Rajasthan", "Goa", "Hyderabad"],
    website: "https://www.bits-pilani.ac.in",
    description: "The best private engineering university in India with zero reservation policy.",
    placements: {
      avgPackage: "18.0 LPA",
      highestPackage: "60.0 LPA",
      recruiters: ["Google", "Microsoft", "Goldman Sachs", "JP Morgan"]
    }
  },
  { 
    name: "IIT Madras", 
    tier: "Elite", 
    type: "Engineering", 
    exam: "JEE Advanced", 
    level: "National",
    cutoff: 99.7, 
    jeeAdvancedCutoff: 99.7,
    branches: ["Computer Science", "Electrical", "Mechanical", "Civil"],
    regions: ["Chennai"],
    website: "https://www.iitm.ac.in",
    description: "Ranked #1 by NIRF for several years, known for its deep tech ecosystem.",
    placements: {
      avgPackage: "22.7 LPA",
      highestPackage: "1.98 CPA",
      recruiters: ["Microsoft", "Intel", "Qualcomm", "Texas Instruments"]
    }
  },
  { 
    name: "NIT Warangal", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    level: "National",
    cutoff: 98.8, 
    jeeCutoff: 98.8,
    branches: ["Computer Science", "Electronics", "Mechanical"],
    regions: ["Telangana"],
    website: "https://www.nitw.ac.in",
    description: "The first NIT ever established in India, highly respected for Engineering.",
    placements: {
      avgPackage: "17.2 LPA",
      highestPackage: "88.0 LPA",
      recruiters: ["Amazon", "Oracle", "ServiceNow", "DE Shaw"]
    }
  },
  { 
    name: "AIIMS Delhi", 
    tier: "Elite", 
    type: "Medical", 
    exam: "NEET", 
    level: "National",
    cutoff: 710, 
    branches: ["MBBS"],
    regions: ["Delhi"],
    website: "https://www.aiims.edu",
    description: "The most prestigious medical institute in India.",
    placements: {
      avgPackage: "N/A",
      highestPackage: "N/A",
      recruiters: ["Top Global Hospitals"]
    }
  },
  { 
    name: "SRCC Delhi", 
    tier: "Elite", 
    type: "Commerce", 
    exam: "CUET", 
    level: "National",
    cutoff: 99.5, 
    branches: ["B.Com (Hons)", "B.A. Economics (Hons)"],
    regions: ["Delhi"],
    website: "https://www.srcc.edu",
    description: "The best commerce college in Asia.",
    placements: {
      avgPackage: "10.5 LPA",
      highestPackage: "35.0 LPA",
      recruiters: ["McKinsey", "BCG", "Bain", "Deutsche Bank"]
    }
  }
];

export const COLLEGE_DB: College[] = [
  // --- Engineering (JEE / CET) ---
  { 
    name: "VNIT Nagpur (NIT Maharashtra)", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    cutoff: 98.5, 
    jeeCutoff: 98.5,
    lastYearCutoff: 98.2,
    branches: ["Computer Science", "IT", "Mechanical", "Civil", "Electronics"],
    branchCutoffs: {
      "Computer Science": 99.4,
      "IT": 99.1,
      "Mechanical": 98.5,
      "Civil": 97.8,
      "Electronics": 98.8
    },
    regions: ["Nagpur", "Vidarbha"], 
    website: "https://vnit.ac.in",
    facilities: ["Olympic-size Swimming Pool", "Mega Hostel (1000+ capacity)", "Advanced Robotics Lab", "Central Library", "Innovation Centre"],
    rankings: ["NIRF Engineering: 41", "Top 10 NITs in India"],
    description: "Visvesvaraya National Institute of Technology, Nagpur is one of the premier NITs in India, known for its strong research focus and excellent placement record in core and IT sectors.",
    placements: {
      avgPackage: "11.5 LPA",
      highestPackage: "52.0 LPA",
      intlPackage: "1.2 CR",
      recruiters: ["Google", "Microsoft", "Amazon", "Tata Motors", "L&T"]
    }
  },
  { 
    name: "COEP Technological University, Pune", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 99.2, 
    cetCutoff: 99.2,
    jeeCutoff: 98.5,
    lastYearCutoff: 99.0,
    branches: ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"],
    branchCutoffs: {
      "Computer Science": 99.8,
      "Electronics": 99.5,
      "Electrical": 99.2,
      "Mechanical": 98.8,
      "Civil": 98.2
    },
    regions: ["Pune", "Western Maharashtra"], 
    website: "https://www.coep.org.in",
    facilities: ["Historic Campus", "Boat Club", "Cyber-Physical Systems Lab", "Incubation Centre", "Smart Classrooms"],
    rankings: ["NIRF Engineering: 73", "Top State Government College in Maharashtra"],
    description: "COEP Technological University is one of the oldest engineering colleges in Asia. It is highly prestigious and offers a unique blend of heritage and modern technology.",
    placements: {
      avgPackage: "9.8 LPA",
      highestPackage: "44.0 LPA",
      intlPackage: "N/A",
      recruiters: ["Goldman Sachs", "Deutsche Bank", "TCS", "Infosys", "Bajaj Auto"]
    }
  },
  { 
    name: "VJTI Mumbai", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 99.5, 
    cetCutoff: 99.5,
    jeeCutoff: 98.8,
    lastYearCutoff: 99.3,
    branches: ["Computer Science", "IT", "Mechanical", "Civil", "Electrical"],
    branchCutoffs: {
      "Computer Science": 99.9,
      "IT": 99.7,
      "Electronics": 99.4,
      "Mechanical": 99.0,
      "Electrical": 98.8
    },
    regions: ["Mumbai", "Konkan"], 
    website: "https://vjti.ac.in",
    facilities: ["Prime Location in Matunga", "Strong Alumni Network", "High-Performance Computing Lab", "Sports Complex", "Technical Festivals"],
    rankings: ["NIRF Engineering: 82", "Top Placement Record in Mumbai"],
    description: "Veermata Jijabai Technological Institute (VJTI) is a premier engineering institute in Mumbai, known for its rigorous academic standards and exceptional industry connections.",
    placements: {
      avgPackage: "12.2 LPA",
      highestPackage: "62.0 LPA",
      intlPackage: "1.1 CR",
      recruiters: ["Morgan Stanley", "J.P. Morgan", "Rakuten", "Samsung", "Reliance"]
    }
  },
  { 
    name: "ICT Mumbai", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 98.8, 
    cetCutoff: 98.8,
    lastYearCutoff: 98.5,
    branches: ["Chemical Engineering", "Food Technology", "Pharmaceutical Technology", "Polymer Engineering"],
    branchCutoffs: {
      "Chemical Engineering": 99.2,
      "Food Technology": 98.5,
      "Pharmaceutical Technology": 98.8,
      "Polymer Engineering": 98.2
    },
    regions: ["Mumbai", "Konkan"], 
    website: "https://www.ictmumbai.edu.in",
    facilities: ["World-class Chemical Labs", "Research Centres", "Hostel", "Library", "Innovation Hub"],
    rankings: ["NIRF Engineering: 24", "Top Chemical Engineering Institute in India"],
    description: "Institute of Chemical Technology (ICT) Mumbai is a premier deamed university focused on chemical technology, pharmacy, and chemical engineering.",
    placements: {
      avgPackage: "8.5 LPA",
      highestPackage: "35.0 LPA",
      intlPackage: "N/A",
      recruiters: ["Reliance Industries", "BASF", "Hindustan Unilever", "Pfizer", "Asian Paints"]
    }
  },
  { 
    name: "SGGSIE&T Nanded", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 94.0, 
    cetCutoff: 94.0,
    lastYearCutoff: 93.5,
    branches: ["Computer Science", "IT", "Mechanical", "Electronics", "Production"],
    branchCutoffs: {
      "Computer Science": 96.5,
      "IT": 95.8,
      "Electronics": 94.0,
      "Mechanical": 92.5,
      "Production": 90.0
    },
    regions: ["Nanded", "Marathwada"], 
    website: "https://sggs.ac.in",
    facilities: ["400-acre Campus", "TEQIP Funded Labs", "Digital Library", "Sports Complex", "Auditorium"],
    rankings: ["Top Autonomous Institute in Marathwada", "A+ Grade by NAAC"],
    description: "Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGSIE&T) is an autonomous institute known for its excellent infrastructure and academic excellence in Marathwada."
  },
  { 
    name: "MGM College of Engineering, Nanded", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 88.0, 
    cetCutoff: 88.0,
    lastYearCutoff: 87.5,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Nanded"], 
    website: "https://mgmcen.ac.in" 
  },
  { 
    name: "NDMVP College of Engineering, Nashik", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 89.5, 
    cetCutoff: 89.5,
    lastYearCutoff: 89.0,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Nashik"], 
    website: "https://kbtcoe.org" 
  },
  { 
    name: "MET Bhujbal Knowledge City, Nashik", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 91.0, 
    cetCutoff: 91.0,
    lastYearCutoff: 90.5,
    branches: ["Computer Science", "IT", "AI & ML", "Mechanical"],
    regions: ["Nashik"], 
    website: "https://metbhujbalknowledgecity.ac.in" 
  },
  { 
    name: "KK Wagh Institute, Nashik", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 92.0, 
    cetCutoff: 92.0,
    lastYearCutoff: 91.5,
    branches: ["Computer Science", "IT", "Mechanical", "Civil", "Electrical"],
    regions: ["Nashik", "North Maharashtra"], 
    website: "https://engg.kkwagh.edu.in" 
  },
  { 
    name: "Walchand College of Engineering, Sangli", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 96.0, 
    minPercentile: 96.0, 
    regions: ["Sangli", "Western Maharashtra"], 
    website: "http://www.walchandsangli.ac.in" 
  },
  { 
    name: "Government Medical College, Nanded", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 590, 
    minPercentile: 96.5, 
    branches: ["MBBS"],
    regions: ["Nanded"], 
    website: "https://gmcnanded.org" 
  },
  { 
    name: "Smt. Kashibai Navale Medical College, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 540, 
    minPercentile: 94.0, 
    branches: ["MBBS"],
    regions: ["Pune"], 
    website: "https://sknmcgh.org" 
  },
  { 
    name: "Government College of Engineering, Nagpur", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 91.0, 
    minPercentile: 91.0, 
    regions: ["Nagpur"], 
    website: "https://gcoen.ac.in" 
  },

  // --- Medical (NEET) ---
  { 
    name: "Grant Medical College (JJ Hospital), Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 650, 
    minPercentile: 99.0, 
    branches: ["MBBS"],
    regions: ["Mumbai"], 
    website: "https://gmcjjh.org",
    facilities: ["Historic JJ Hospital Campus", "Advanced Surgery Units", "Research Labs", "Extensive Medical Library"],
    rankings: ["Top 10 Medical Colleges in India", "Premier Institute in Maharashtra"],
    description: "Grant Medical College and Sir J.J. Group of Hospitals is one of the oldest and most prestigious medical institutions in India, offering unparalleled clinical exposure."
  },
  { 
    name: "BJ Medical College, Pune", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 640, 
    minPercentile: 98.5, 
    branches: ["MBBS"],
    regions: ["Pune"], 
    website: "https://bjmc.edu.in",
    facilities: ["Sassoon General Hospital Attachment", "Modern Lecture Halls", "Specialized Research Centres", "Hostel Facilities"],
    rankings: ["Top Tier Medical College in Pune", "Highly Ranked in Maharashtra"],
    description: "B. J. Medical College, Pune is a premier government medical college attached to the Sassoon General Hospital, providing excellent medical education and healthcare services."
  },
  { 
    name: "Government Medical College, Nagpur", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 620, 
    minPercentile: 98.0, 
    branches: ["MBBS"],
    regions: ["Nagpur"], 
    website: "https://gmcnagpur.org" 
  },
  { 
    name: "Dr. Vasantrao Pawar Medical College, Nashik", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 550, 
    minPercentile: 95.0, 
    branches: ["MBBS"],
    regions: ["Nashik"], 
    website: "https://drvasantraopawarmcoerc.org" 
  },
  { 
    name: "Dr. Shankarrao Chavan GMC, Nanded", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 580, 
    minPercentile: 96.0, 
    branches: ["MBBS"],
    regions: ["Nanded"], 
    website: "https://gmcnanded.org" 
  },

  // --- Polytechnic (SSC / CBSE) ---
  { 
    name: "Government Polytechnic, Mumbai", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 92.0, 
    minPercentile: 92.0, 
    regions: ["Mumbai"], 
    website: "https://gpmumbai.ac.in" 
  },
  { 
    name: "Government Polytechnic, Pune", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 90.0, 
    minPercentile: 90.0, 
    regions: ["Pune"], 
    website: "https://gppune.ac.in" 
  },
  { 
    name: "Government Polytechnic, Nashik", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 85.0, 
    minPercentile: 85.0, 
    regions: ["Nashik"], 
    website: "https://gpnashik.ac.in" 
  },
  { 
    name: "Government Polytechnic, Nagpur", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 82.0, 
    minPercentile: 82.0, 
    regions: ["Nagpur"], 
    website: "https://gpnagpur.ac.in" 
  },
  { 
    name: "Government Polytechnic, Nanded", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 78.0, 
    minPercentile: 78.0, 
    regions: ["Nanded"], 
    website: "https://gpnanded.org.in" 
  },
  { 
    name: "Sardar Patel Institute of Technology (SPIT), Mumbai", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 98.5, 
    cetCutoff: 98.5,
    jeeCutoff: 97.5,
    lastYearCutoff: 98.2,
    branches: ["Computer Engineering", "IT", "Electronics & Telecom", "CS (Data Science)"],
    branchCutoffs: {
      "Computer Engineering": 99.5,
      "IT": 99.2,
      "Electronics & Telecom": 98.5,
      "CS (Data Science)": 99.0
    },
    regions: ["Mumbai"], 
    website: "https://www.spit.ac.in",
    facilities: ["Andheri West Campus", "Innovation & Incubation Centre", "Modern Computer Labs", "Library", "Placement Cell"],
    rankings: ["NIRF Engineering: 125", "Top Private Engineering College in Mumbai"],
    description: "Sardar Patel Institute of Technology (SPIT) is a premier autonomous engineering college in Mumbai, known for its high academic standards and excellent placements.",
    placements: {
      avgPackage: "10.5 LPA",
      highestPackage: "42.0 LPA",
      intlPackage: "N/A",
      recruiters: ["Workday", "Barclays", "Credit Suisse", "Quantiphi", "Oracle"]
    }
  },
  { 
    name: "Dwarkadas J. Sanghvi College of Engineering, Mumbai", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 97.0, 
    cetCutoff: 97.0,
    jeeCutoff: 96.0,
    lastYearCutoff: 96.5,
    branches: ["Computer Science", "IT", "Mechanical", "Electronics"],
    regions: ["Mumbai"], 
    website: "https://www.djsce.ac.in" 
  },
  { 
    name: "PICT Pune", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 98.2, 
    cetCutoff: 98.2,
    jeeCutoff: 97.5,
    lastYearCutoff: 98.0,
    branches: ["Computer Engineering", "IT", "Electronics & Telecom"],
    branchCutoffs: {
      "Computer Engineering": 99.4,
      "IT": 99.1,
      "Electronics & Telecom": 98.2
    },
    regions: ["Pune"], 
    website: "https://pict.edu",
    facilities: ["Specialized IT Labs", "Digital Library", "Hostel", "Research Centre", "Startup Incubation"],
    rankings: ["Top Private Engineering College in Pune", "Known as the IT Hub of Pune"],
    description: "Pune Institute of Computer Technology (PICT) is a private engineering college in Pune, highly regarded for its focus on computer engineering and information technology.",
    placements: {
      avgPackage: "11.0 LPA",
      highestPackage: "45.0 LPA",
      intlPackage: "N/A",
      recruiters: ["PhonePe", "Mastercard", "Nvidia", "Adobe", "Veritas"]
    }
  },
  { 
    name: "VIT Pune", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 96.5, 
    cetCutoff: 96.5,
    jeeCutoff: 95.0,
    lastYearCutoff: 96.0,
    branches: ["Computer Science", "IT", "Mechanical", "Electronics"],
    regions: ["Pune"], 
    website: "https://www.vit.edu" 
  },
  { 
    name: "Government College of Engineering, Aurangabad", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 94.5, 
    cetCutoff: 94.5,
    lastYearCutoff: 94.0,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Aurangabad", "Marathwada"], 
    website: "https://geca.ac.in" 
  },
  { 
    name: "Government Medical College, Aurangabad", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 610, 
    minPercentile: 97.5, 
    branches: ["MBBS"],
    regions: ["Aurangabad"], 
    website: "https://gmcaurangabad.com" 
  },
  { 
    name: "Government Polytechnic, Aurangabad", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 80.0, 
    minPercentile: 80.0, 
    regions: ["Aurangabad"], 
    website: "https://gpaurangabad.org" 
  },
  // --- Additional Engineering ---
  { 
    name: "Government College of Engineering, Amravati", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 93.5, 
    cetCutoff: 93.5,
    lastYearCutoff: 93.0,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Amravati", "Vidarbha"], 
    website: "https://gcoea.ac.in" 
  },
  { 
    name: "Prof. Ram Meghe Institute of Technology, Amravati", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 88.0, 
    cetCutoff: 88.0,
    lastYearCutoff: 87.5,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Amravati"], 
    website: "https://mitra.ac.in" 
  },
  { 
    name: "Government College of Engineering, Karad", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 95.0, 
    minPercentile: 95.0, 
    regions: ["Karad", "Satara", "Western Maharashtra"], 
    website: "https://gcekarad.ac.in" 
  },
  { 
    name: "K. J. Somaiya College of Engineering, Mumbai", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 98.0, 
    minPercentile: 98.0, 
    regions: ["Mumbai"], 
    website: "https://kjsce.somaiya.edu" 
  },
  { 
    name: "Thadomal Shahani Engineering College, Mumbai", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 96.5, 
    minPercentile: 96.5, 
    regions: ["Mumbai"], 
    website: "https://tsec.edu" 
  },
  { 
    name: "MIT Academy of Engineering, Alandi", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 94.0, 
    minPercentile: 94.0, 
    regions: ["Pune", "Alandi"], 
    website: "https://mitaoe.ac.in" 
  },
  { 
    name: "Cummins College of Engineering for Women, Pune", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 97.5, 
    minPercentile: 97.5, 
    regions: ["Pune"], 
    website: "https://cumminscollege.org" 
  },
  { 
    name: "Government College of Engineering, Jalgaon", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 90.5, 
    minPercentile: 90.5, 
    regions: ["Jalgaon", "North Maharashtra"], 
    website: "https://gcoej.ac.in" 
  },
  { 
    name: "Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 94.2, 
    minPercentile: 94.2, 
    regions: ["Nanded"], 
    website: "https://sggs.ac.in" 
  },
  { 
    name: "Rajarambapu Institute of Technology, Islampur", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 89.0, 
    minPercentile: 89.0, 
    regions: ["Sangli", "Islampur"], 
    website: "https://ritindia.edu" 
  },
  { 
    name: "DKTE Society's Textile and Engineering Institute, Ichalkaranji", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 87.5, 
    minPercentile: 87.5, 
    regions: ["Kolhapur", "Ichalkaranji"], 
    website: "https://dkte.ac.in" 
  },
  { 
    name: "Kolhapur Institute of Technology's College of Engineering (KIT), Kolhapur", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 91.5, 
    minPercentile: 91.5, 
    regions: ["Kolhapur"], 
    website: "https://kitcoek.in" 
  },
  { 
    name: "Walchand Institute of Technology (WIT), Solapur", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 90.0, 
    minPercentile: 90.0, 
    regions: ["Solapur"], 
    website: "https://witsolapur.org" 
  },

  // --- Additional Medical ---
  { 
    name: "HBT Medical College & Cooper Hospital, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 630, 
    minPercentile: 98.2, 
    branches: ["MBBS"],
    regions: ["Mumbai"], 
    website: "https://hbtmc.edu.in" 
  },
  { 
    name: "Lokmanya Tilak Municipal Medical College (Sion Hospital), Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 645, 
    minPercentile: 98.8, 
    branches: ["MBBS"],
    regions: ["Mumbai"], 
    website: "https://ltmgh.com" 
  },
  { 
    name: "Topiwala National Medical College (Nair Hospital), Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 642, 
    minPercentile: 98.7, 
    branches: ["MBBS"],
    regions: ["Mumbai"], 
    website: "https://tnmc.edu.in" 
  },
  { 
    name: "Government Medical College, Latur", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 595, 
    minPercentile: 96.8, 
    branches: ["MBBS"],
    regions: ["Latur", "Marathwada"], 
    website: "https://gmclatur.org" 
  },
  { 
    name: "Government Medical College, Akola", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 585, 
    minPercentile: 96.2, 
    branches: ["MBBS"],
    regions: ["Akola", "Vidarbha"], 
    website: "https://gmcakola.in" 
  },
  { 
    name: "Government Medical College, Miraj", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 605, 
    minPercentile: 97.2, 
    branches: ["MBBS"],
    regions: ["Miraj", "Sangli"], 
    website: "https://gmcmiraj.edu.in" 
  },
  { 
    name: "Government Medical College, Kolhapur", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 615, 
    minPercentile: 97.8, 
    branches: ["MBBS"],
    regions: ["Kolhapur"], 
    website: "https://rcsmgmc.ac.in" 
  },
  { 
    name: "Sumatibhai Shah Ayurved Mahavidyalaya, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 450, 
    minPercentile: 85.0, 
    branches: ["BAMS"],
    regions: ["Pune"], 
    website: "https://ssam.in",
    description: "A premier institute for Ayurvedic studies in Pune, offering BAMS and MD courses."
  },
  { 
    name: "Ashtang Ayurved Mahavidyalaya, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 420, 
    minPercentile: 82.0, 
    branches: ["BAMS"],
    regions: ["Pune"], 
    website: "https://ashtangayurved.com" 
  },
  { 
    name: "Dr. J. J. Magdum Homoeopathic Medical College, Jaysingpur", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 350, 
    minPercentile: 75.0, 
    branches: ["BHMS"],
    regions: ["Kolhapur", "Jaysingpur"], 
    website: "https://jjmhmc.org" 
  },
  { 
    name: "Foster Development's Homoeopathic Medical College, Aurangabad", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 320, 
    minPercentile: 70.0, 
    branches: ["BHMS"],
    regions: ["Aurangabad"], 
    website: "https://fdhmc.edu.in" 
  },
  { 
    name: "Dr. D. Y. Patil Homoeopathic Medical College, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 380, 
    minPercentile: 78.0, 
    branches: ["BHMS"],
    regions: ["Pune"], 
    website: "https://homoeopathy.dypvp.edu.in" 
  },
  { 
    name: "Motiwala Homoeopathic Medical College, Nashik", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 300, 
    minPercentile: 65.0, 
    branches: ["BHMS"],
    regions: ["Nashik"], 
    website: "https://motiwalaent.org" 
  },
  { 
    name: "Smt. Kanchanbai Babulalji Abad Homoeopathic Medical College, Chandwad", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 280, 
    minPercentile: 60.0, 
    branches: ["BHMS"],
    regions: ["Nashik", "Chandwad"], 
    website: "https://snjb.org" 
  },
  { 
    name: "Yashwantrao Chavan Ayurvedic Medical College, Aurangabad", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 340, 
    minPercentile: 72.0, 
    branches: ["BAMS"],
    regions: ["Aurangabad"], 
    website: "https://ycamc.org" 
  },
  { 
    name: "Government Dental College & Hospital, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 580, 
    minPercentile: 96.0, 
    branches: ["BDS"],
    regions: ["Mumbai"], 
    website: "https://gdcmumbai.org" 
  },
  { 
    name: "Government Dental College & Hospital, Nagpur", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 560, 
    minPercentile: 95.0, 
    branches: ["BDS"],
    regions: ["Nagpur"], 
    website: "https://gdcnagpur.org" 
  },
  { 
    name: "Nair Hospital Dental College, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 575, 
    minPercentile: 95.8, 
    branches: ["BDS"],
    regions: ["Mumbai"], 
    website: "https://nairdental.edu.in" 
  },
  { 
    name: "Mohammadia Tibbia College, Malegaon", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 380, 
    minPercentile: 80.0, 
    branches: ["BUMS"],
    regions: ["Nashik", "Malegaon"], 
    website: "https://mtcmalegaon.com" 
  },
  { 
    name: "Sancheti College of Physiotherapy, Pune", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 480, 
    minPercentile: 88.0, 
    branches: ["BPTh (Physiotherapy)"],
    regions: ["Pune"], 
    website: "https://sanchetiphysiotherapy.edu.in" 
  },
  { 
    name: "K. J. Somaiya College of Physiotherapy, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 490, 
    minPercentile: 89.0, 
    branches: ["BPTh (Physiotherapy)"],
    regions: ["Mumbai"], 
    website: "https://physiotherapy.somaiya.edu" 
  },
  { 
    name: "Bombay Hospital College of Nursing, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 350, 
    minPercentile: 75.0, 
    branches: ["B.Sc Nursing"],
    regions: ["Mumbai"], 
    website: "https://bombayhospital.com/nursing" 
  },
  { 
    name: "Mumbai Veterinary College, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 520, 
    minPercentile: 92.0, 
    branches: ["BVSc & AH"],
    regions: ["Mumbai"], 
    website: "https://mvc.ac.in" 
  },

  // --- Additional Polytechnic ---
  { 
    name: "Government Polytechnic, Amravati", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 81.0, 
    minPercentile: 81.0, 
    regions: ["Amravati"], 
    website: "https://gpamravati.ac.in" 
  },
  { 
    name: "Government Polytechnic, Kolhapur", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 83.5, 
    minPercentile: 83.5, 
    regions: ["Kolhapur"], 
    website: "https://gpkolhapur.org.in" 
  },
  { 
    name: "Government Polytechnic, Jalgaon", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 79.5, 
    minPercentile: 79.5, 
    regions: ["Jalgaon"], 
    website: "https://gpjalgaon.org.in" 
  },
  { 
    name: "Government Polytechnic, Solapur", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 77.0, 
    minPercentile: 77.0, 
    regions: ["Solapur"], 
    website: "https://gpsolapur.ac.in" 
  },
  { 
    name: "Government Polytechnic, Karad", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 84.0, 
    minPercentile: 84.0, 
    regions: ["Karad", "Satara"], 
    website: "https://gpkarad.ac.in" 
  },
  { 
    name: "Government Polytechnic, Ratnagiri", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 75.0, 
    minPercentile: 75.0, 
    regions: ["Ratnagiri", "Konkan"], 
    website: "https://gpratnagiri.org.in" 
  },
  { 
    name: "Government Polytechnic, Gadchiroli", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 60.0, 
    minPercentile: 60.0, 
    regions: ["Gadchiroli", "Vidarbha"], 
    website: "https://gpgadchiroli.ac.in" 
  },
  { 
    name: "Government Polytechnic, Washim", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 62.0, 
    minPercentile: 62.0, 
    regions: ["Washim", "Vidarbha"], 
    website: "https://gpwashim.ac.in" 
  },
  { 
    name: "Government Polytechnic, Hingoli", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 65.0, 
    minPercentile: 65.0, 
    regions: ["Hingoli", "Marathwada"], 
    website: "https://gphingoli.org.in" 
  },
  { 
    name: "Government Polytechnic, Nandurbar", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 58.0, 
    minPercentile: 58.0, 
    regions: ["Nandurbar", "North Maharashtra"], 
    website: "https://gpnandurbar.org.in" 
  },
  { 
    name: "Government Polytechnic, Osmanabad", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 63.0, 
    minPercentile: 63.0, 
    regions: ["Osmanabad", "Marathwada"], 
    website: "https://gposmanabad.org" 
  },
  { 
    name: "Government Polytechnic, Beed", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 61.0, 
    minPercentile: 61.0, 
    regions: ["Beed", "Marathwada"], 
    website: "https://gpbeed.ac.in" 
  },
  // --- Tier 2 & 3 Engineering Expansion ---
  { 
    name: "IIIT Nagpur", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    cutoff: 97.0, 
    jeeCutoff: 97.0,
    lastYearCutoff: 96.5,
    branches: ["Computer Science", "Electronics"],
    regions: ["Nagpur"], 
    website: "https://iiitn.ac.in" 
  },
  { 
    name: "IIIT Pune", 
    tier: 1, 
    type: "Engineering", 
    exam: "JEE Main", 
    cutoff: 98.0, 
    jeeCutoff: 98.0,
    lastYearCutoff: 97.5,
    branches: ["Computer Science", "Electronics"],
    regions: ["Pune"], 
    website: "https://iiitp.ac.in" 
  },
  { 
    name: "PCCOE Pune", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 97.5, 
    cetCutoff: 97.5,
    lastYearCutoff: 97.0,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Pune"], 
    website: "https://www.pccoepune.com" 
  },
  { 
    name: "RCOEM Nagpur", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 96.0, 
    cetCutoff: 96.0,
    lastYearCutoff: 95.5,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Nagpur"], 
    website: "https://www.rknec.edu" 
  },
  { 
    name: "YCCE Nagpur", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 92.5, 
    cetCutoff: 92.5,
    lastYearCutoff: 92.0,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Nagpur"], 
    website: "https://www.ycce.edu" 
  },
  { 
    name: "G. H. Raisoni College of Engineering, Nagpur", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 88.0, 
    cetCutoff: 88.0,
    lastYearCutoff: 87.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nagpur"], 
    website: "https://ghrce.raisoni.net" 
  },
  { 
    name: "SPCE Mumbai", 
    tier: 1, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 98.0, 
    cetCutoff: 98.0,
    lastYearCutoff: 97.5,
    branches: ["Civil", "Mechanical", "Electrical"],
    regions: ["Mumbai"], 
    website: "https://www.spce.ac.in" 
  },
  { 
    name: "Fr. Conceicao Rodrigues College of Engineering (CRCE), Mumbai", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 95.5, 
    cetCutoff: 95.5,
    lastYearCutoff: 95.0,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Mumbai"], 
    website: "https://www.frcrce.ac.in" 
  },
  { 
    name: "Vidyalankar Institute of Technology (VIT), Mumbai", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 91.0, 
    cetCutoff: 91.0,
    lastYearCutoff: 90.5,
    branches: ["Computer Science", "IT", "Electronics"],
    regions: ["Mumbai"], 
    website: "https://vit.edu.in" 
  },
  { 
    name: "Don Bosco Institute of Technology (DBIT), Mumbai", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 89.0, 
    cetCutoff: 89.0,
    lastYearCutoff: 88.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Mumbai"], 
    website: "https://www.dbit.in" 
  },
  { 
    name: "VIIT Pune", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 95.8, 
    cetCutoff: 95.8,
    lastYearCutoff: 95.0,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Pune"], 
    website: "https://www.viit.ac.in" 
  },
  { 
    name: "DY Patil College of Engineering, Akurdi, Pune", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 94.5, 
    cetCutoff: 94.5,
    lastYearCutoff: 94.0,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Pune"], 
    website: "https://www.dypcoeakurdi.ac.in" 
  },
  { 
    name: "Sinhgad College of Engineering, Pune", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 90.0, 
    cetCutoff: 90.0,
    lastYearCutoff: 89.5,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Pune"], 
    website: "https://sinhgad.edu" 
  },
  { 
    name: "Sandip Foundation's SITRC, Nashik", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 85.0, 
    cetCutoff: 85.0,
    lastYearCutoff: 84.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nashik"], 
    website: "https://sandipfoundation.org" 
  },
  { 
    name: "Gokhale Education Society's R. H. Sapat COE, Nashik", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 87.0, 
    cetCutoff: 87.0,
    lastYearCutoff: 86.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nashik"], 
    website: "https://ges-coengg.org" 
  },
  { 
    name: "Matoshri College of Engineering, Nashik", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 82.0, 
    cetCutoff: 82.0,
    lastYearCutoff: 81.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nashik"], 
    website: "https://engg.matoshri.edu.in" 
  },
  { 
    name: "SNJB's KBJ College of Engineering, Chandwad, Nashik", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 80.0, 
    cetCutoff: 80.0,
    lastYearCutoff: 79.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nashik"], 
    website: "https://www.snjb.org" 
  },
  { 
    name: "Matoshri Pratishthan Group of Institutions, Nanded", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 78.0, 
    cetCutoff: 78.0,
    lastYearCutoff: 77.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nanded"], 
    website: "https://mpgin.edu.in" 
  },
  { 
    name: "Priyadarshini College of Engineering, Nagpur", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 84.0, 
    cetCutoff: 84.0,
    lastYearCutoff: 83.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Nagpur"], 
    website: "https://www.pcenagpur.edu.in" 
  },
  { 
    name: "Anjuman College of Engineering, Nagpur", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 70.0, 
    cetCutoff: 70.0,
    lastYearCutoff: 69.5,
    branches: ["Computer Science", "Mechanical", "Civil", "Electrical"],
    regions: ["Nagpur"], 
    website: "https://anjumanengg.edu.in" 
  },
  { 
    name: "Smt. Indira Gandhi College of Engineering, Navi Mumbai", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 65.0, 
    cetCutoff: 65.0,
    lastYearCutoff: 64.0,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Navi Mumbai"], 
    website: "https://sigce.edu.in" 
  },
  { 
    name: "Saraswati College of Engineering, Kharghar", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 68.0, 
    cetCutoff: 68.0,
    lastYearCutoff: 67.5,
    branches: ["Computer Science", "IT", "Civil", "Mechanical"],
    regions: ["Navi Mumbai"], 
    website: "https://sce.edu.in" 
  },
  { 
    name: "A. P. Shah Institute of Technology, Thane", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 82.0, 
    cetCutoff: 82.0,
    lastYearCutoff: 81.0,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Thane"], 
    website: "https://www.apsit.edu.in" 
  },
  { 
    name: "Datta Meghe College of Engineering, Airoli", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 72.0, 
    cetCutoff: 72.0,
    lastYearCutoff: 71.5,
    branches: ["Computer Science", "IT", "Chemical", "Civil"],
    regions: ["Navi Mumbai", "Mumbai"], 
    website: "https://dmce.ac.in" 
  },
  { 
    name: "JSPM's Rajarshi Shahu College of Engineering, Pune", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 79.0, 
    cetCutoff: 79.0,
    lastYearCutoff: 78.5,
    branches: ["Computer Science", "IT", "Mechanical", "Civil"],
    regions: ["Pune"], 
    website: "https://jspmrscoe.edu.in" 
  },
  { 
    name: "Modern Education Society's College of Engineering, Pune", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 74.0, 
    cetCutoff: 74.0,
    lastYearCutoff: 73.5,
    branches: ["Computer Science", "IT", "Mechanical"],
    regions: ["Pune"], 
    website: "https://mescoepune.org" 
  },
  { 
    name: "Siddharth Institute of Engineering and Technology, Pune", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 60.0, 
    cetCutoff: 60.0,
    lastYearCutoff: 59.0,
    branches: ["Computer Science", "Mechanical", "Civil"],
    regions: ["Pune"], 
    website: "https://siddharthgroup.org" 
  },
  // --- Expanded Medical (NEET) Tier 2 & 3 ---
  { 
    name: "Terna Medical College, Navi Mumbai", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 520, 
    minPercentile: 92.0, 
    branches: ["MBBS"],
    regions: ["Navi Mumbai", "Mumbai"], 
    website: "https://ternamedical.org" 
  },
  { 
    name: "KJ Somaiya Medical College, Mumbai", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 540, 
    minPercentile: 94.0, 
    branches: ["MBBS"],
    regions: ["Mumbai"], 
    website: "https://mims.somaiya.edu" 
  },
  { 
    name: "ACPM Medical College, Dhule", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 480, 
    minPercentile: 88.0, 
    branches: ["MBBS"],
    regions: ["Dhule", "North Maharashtra"], 
    website: "https://acpmjmf.com" 
  },
  { 
    name: "SMBT Institute of Medical Sciences, Nashik", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 490, 
    minPercentile: 89.0, 
    branches: ["MBBS"],
    regions: ["Nashik"], 
    website: "https://smbt.edu.in" 
  },
  { 
    name: "Vedant Institute of Medical Sciences, Palghar", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 450, 
    minPercentile: 85.0, 
    branches: ["MBBS"],
    regions: ["Palghar", "Konkan"], 
    website: "https://vims.edu.in" 
  },
  { 
    name: "Dr. Panjabrao Deshmukh Memorial Medical College, Amravati", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 510, 
    minPercentile: 91.0, 
    branches: ["MBBS"],
    regions: ["Amravati", "Vidarbha"], 
    website: "https://pdmmc.com" 
  },
  { 
    name: "Vasantrao Naik GMC, Yavatmal", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 560, 
    minPercentile: 95.0, 
    branches: ["MBBS"],
    regions: ["Yavatmal", "Vidarbha"], 
    website: "https://vngmc.ac.in" 
  },
  { 
    name: "Government Dental College, Aurangabad", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 450, 
    minPercentile: 85.0, 
    branches: ["BDS"],
    regions: ["Aurangabad"], 
    website: "https://gdcaurangabad.com" 
  },
  { 
    name: "CSMSS Dental College, Aurangabad", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 350, 
    minPercentile: 75.0, 
    branches: ["BDS"],
    regions: ["Aurangabad"], 
    website: "https://csmssdental.com" 
  },
  { 
    name: "Dr. DY Patil Dental College, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 400, 
    minPercentile: 80.0, 
    branches: ["BDS"],
    regions: ["Pune"], 
    website: "https://dental.dypvp.edu.in" 
  },
  { 
    name: "Podar Ayurved Medical College, Mumbai", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 480, 
    minPercentile: 88.0, 
    branches: ["BAMS"],
    regions: ["Mumbai"], 
    website: "https://raapodar.org" 
  },
  { 
    name: "Government Ayurved College, Nagpur", 
    tier: 1, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 460, 
    minPercentile: 86.0, 
    branches: ["BAMS"],
    regions: ["Nagpur"], 
    website: "https://gacnagpur.org" 
  },
  { 
    name: "Tilak Ayurved Mahavidyalaya, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 440, 
    minPercentile: 84.0, 
    branches: ["BAMS"],
    regions: ["Pune"], 
    website: "https://tmv.edu.in" 
  },
  { 
    name: "Dr. GD Pol Foundation YMT Ayurvedic Medical College, Navi Mumbai", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 350, 
    minPercentile: 75.0, 
    branches: ["BAMS"],
    regions: ["Navi Mumbai"], 
    website: "https://ymtmedical.org" 
  },
  { 
    name: "Sai Ayurved College, Sasure, Solapur", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 300, 
    minPercentile: 70.0, 
    branches: ["BAMS"],
    regions: ["Solapur"], 
    website: "https://saiayurved.com" 
  },
  { 
    name: "Government Homoeopathic Medical College, Jalgaon", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 350, 
    minPercentile: 75.0, 
    branches: ["BHMS"],
    regions: ["Jalgaon"], 
    website: "https://ghmcjalgaon.org" 
  },
  { 
    name: "Dhondumama Sathe Homoeopathic Medical College, Pune", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 320, 
    minPercentile: 70.0, 
    branches: ["BHMS"],
    regions: ["Pune"], 
    website: "https://dshmc.edu.in" 
  },
  { 
    name: "Virar Homoeopathic Medical College, Virar", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 250, 
    minPercentile: 60.0, 
    branches: ["BHMS"],
    regions: ["Virar", "Konkan"], 
    website: "https://vhmc.org" 
  },
  { 
    name: "Anjuman-I-Islam's Tibbia College, Mumbai", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 350, 
    minPercentile: 75.0, 
    branches: ["BUMS"],
    regions: ["Mumbai"], 
    website: "https://aitibbiacollege.com" 
  },
  { 
    name: "Zulekha Tibbia College, Pune", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 280, 
    minPercentile: 65.0, 
    branches: ["BUMS"],
    regions: ["Pune"], 
    website: "https://zulekhatibbiacollege.com" 
  },
  { 
    name: "MGM College of Nursing, Navi Mumbai", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 250, 
    minPercentile: 60.0, 
    branches: ["B.Sc Nursing"],
    regions: ["Navi Mumbai"], 
    website: "https://mgmcn.edu.in" 
  },
  { 
    name: "Tehmi Grant Institute of Nursing Education, Pune", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 200, 
    minPercentile: 50.0, 
    branches: ["B.Sc Nursing"],
    regions: ["Pune"], 
    website: "https://tgine.com" 
  },
  { 
    name: "Dr. Vithalrao Vikhe Patil Foundation's College of Nursing, Ahmednagar", 
    tier: 3, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 180, 
    minPercentile: 45.0, 
    branches: ["B.Sc Nursing"],
    regions: ["Ahmednagar"], 
    website: "https://vims.edu.in/nursing" 
  },
  { 
    name: "Rural Medical College, Loni", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 530, 
    minPercentile: 93.0, 
    branches: ["MBBS"],
    regions: ["Ahmednagar", "Loni"], 
    website: "https://pravara.com" 
  },
  { 
    name: "Krishna Institute of Medical Sciences, Karad", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 510, 
    minPercentile: 91.0, 
    branches: ["MBBS"],
    regions: ["Karad", "Satara"], 
    website: "https://kimskarad.in" 
  },
  { 
    name: "MGM Medical College, Aurangabad", 
    tier: 2, 
    type: "Medical", 
    exam: "NEET", 
    cutoff: 520, 
    minPercentile: 92.0, 
    branches: ["MBBS"],
    regions: ["Aurangabad"], 
    website: "https://mgmmcha.org" 
  },
  // --- Commerce (12th % / Entrance) ---
  { 
    name: "Sydenham College of Commerce and Economics, Mumbai", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 92.0, 
    branches: ["B.Com", "BMS", "BMM"],
    regions: ["Mumbai"], 
    website: "https://sydenham.ac.in",
    description: "One of the oldest and most prestigious commerce colleges in India, known for its strong alumni network and academic excellence."
  },
  { 
    name: "H.R. College of Commerce and Economics, Mumbai", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 94.0, 
    branches: ["B.Com", "BMS", "BMM", "B.Voc"],
    regions: ["Mumbai"], 
    website: "https://hrcollege.edu",
    description: "Highly ranked commerce college in Mumbai, famous for its vibrant campus life and excellent placement opportunities."
  },
  { 
    name: "R.A. Podar College of Commerce and Economics, Mumbai", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 93.5, 
    branches: ["B.Com", "BMS"],
    regions: ["Mumbai"], 
    website: "https://rapodar.ac.in" 
  },
  { 
    name: "Brihan Maharashtra College of Commerce (BMCC), Pune", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 91.0, 
    branches: ["B.Com", "BBA", "BMS"],
    regions: ["Pune"], 
    website: "https://bmcc.ac.in",
    description: "A premier commerce college in Pune, known for its academic rigour and holistic development of students."
  },
  { 
    name: "Ness Wadia College of Commerce, Pune", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 85.0, 
    branches: ["B.Com", "BBA"],
    regions: ["Pune"], 
    website: "https://nesswadiacollege.edu.in" 
  },
  { 
    name: "Garware College of Commerce, Pune", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 82.0, 
    branches: ["B.Com", "BBA"],
    regions: ["Pune"], 
    website: "https://gcc.mespune.in" 
  },
  { 
    name: "Narsee Monjee College of Commerce and Economics, Mumbai", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 95.0, 
    branches: ["B.Com", "BMS", "BMM"],
    regions: ["Mumbai"], 
    website: "https://nmcollege.in" 
  },
  { 
    name: "Mithibai College, Mumbai", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 93.0, 
    branches: ["B.Com", "BMS", "BMM"],
    regions: ["Mumbai"], 
    website: "https://mithibai.ac.in" 
  },
  { 
    name: "Symbiosis College of Arts and Commerce, Pune", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 90.0, 
    branches: ["B.Com", "BBA"],
    regions: ["Pune"], 
    website: "https://symbiosiscollege.edu.in" 
  },
  { 
    name: "St. Xavier's College, Mumbai (Commerce Section)", 
    tier: 1, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 94.5, 
    branches: ["B.Com", "BMS"],
    regions: ["Mumbai"], 
    website: "https://xaviers.edu" 
  },
  { 
    name: "Lala Lajpatrai College of Commerce and Economics, Mumbai", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 80.0, 
    branches: ["B.Com", "BMS"],
    regions: ["Mumbai"], 
    website: "https://lalacollege.edu.in" 
  },
  { 
    name: "K.C. College, Mumbai", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 88.0, 
    branches: ["B.Com", "BMS", "BMM"],
    regions: ["Mumbai"], 
    website: "https://kccollege.edu.in" 
  },
  { 
    name: "BYK College of Commerce, Nashik", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 75.0, 
    branches: ["B.Com", "BBA"],
    regions: ["Nashik"], 
    website: "https://bykcollege.com" 
  },
  { 
    name: "GS College of Commerce and Economics, Nagpur", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 78.0, 
    branches: ["B.Com", "BBA"],
    regions: ["Nagpur"], 
    website: "https://gscen.shikshandal.org" 
  },
  { 
    name: "Dhanwate National College, Nagpur", 
    tier: 3, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 70.0, 
    branches: ["B.Com", "BBA"],
    regions: ["Nagpur"], 
    website: "https://dhanwatenationalcollege.com" 
  },
  { 
    name: "Chhatrapati Shahu Institute of Business Education and Research (SIBER), Kolhapur", 
    tier: 2, 
    type: "Commerce", 
    exam: "12th Commerce %", 
    cutoff: 72.0, 
    branches: ["BBA", "BCA", "B.Com"],
    regions: ["Kolhapur"], 
    website: "https://siberindia.edu.in" 
  },
  { 
    name: "NMIMS School of Commerce, Mumbai", 
    tier: 1, 
    type: "Commerce", 
    exam: "NPAT", 
    cutoff: 88.0, 
    branches: ["BBA", "B.Com (Hons)"],
    regions: ["Mumbai"], 
    website: "https://commerce.nmims.edu" 
  },
  { 
    name: "Symbiosis Centre for Management Studies (SCMS), Pune", 
    tier: 1, 
    type: "Commerce", 
    exam: "SET", 
    cutoff: 92.0, 
    branches: ["BBA"],
    regions: ["Pune"], 
    website: "https://scmspune.ac.in" 
  },
  { 
    name: "IIM Indore (IPM)", 
    tier: 1, 
    type: "Commerce", 
    exam: "IPMAT", 
    cutoff: 98.5, 
    branches: ["IPM (BBA+MBA)"],
    regions: ["National"], 
    website: "https://iimidr.ac.in" 
  },
  { 
    name: "Shri Ram College of Commerce (SRCC), Delhi", 
    tier: 1, 
    type: "Commerce", 
    exam: "CUET", 
    cutoff: 99.0, 
    branches: ["B.Com (Hons)", "B.A. (Hons) Economics"],
    regions: ["National"], 
    website: "https://srcc.edu" 
  },
  { 
    name: "Hindu College, Delhi", 
    tier: 1, 
    type: "Commerce", 
    exam: "CUET", 
    cutoff: 98.0, 
    branches: ["B.Com (Hons)"],
    regions: ["National"], 
    website: "https://hinducollege.ac.in" 
  },
  { 
    name: "St. Joseph's College of Commerce, Bangalore", 
    tier: 1, 
    type: "Commerce", 
    exam: "CUET", 
    cutoff: 95.0, 
    branches: ["B.Com", "BBA"],
    regions: ["National"], 
    website: "https://sjcc.edu.in" 
  },
  { 
    name: "MMK College of Commerce and Economics, Mumbai", 
    tier: 2, 
    type: "Commerce", 
    exam: "MAH-BMS-CET", 
    cutoff: 82.0, 
    branches: ["BMS", "BBA"],
    regions: ["Mumbai"], 
    website: "https://mmk.edu.in" 
  },
  { 
    name: "Pillai College of Arts, Commerce and Science, Navi Mumbai", 
    tier: 2, 
    type: "Commerce", 
    exam: "MAH-BMS-CET", 
    cutoff: 78.0, 
    branches: ["BMS", "BMM", "B.Com"],
    regions: ["Navi Mumbai"], 
    website: "https://pcacs.ac.in" 
  },
  // --- Tier 3 & 4 Engineering (Lower Percentile) ---
  { 
    name: "Saraswati College of Engineering, Navi Mumbai", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 65.0, 
    cetCutoff: 65.0,
    jeeCutoff: 60.0,
    branches: ["Computer Engineering", "Mechanical", "Civil", "IT"],
    regions: ["Navi Mumbai", "Kharghar"], 
    website: "https://sce.edu.in" 
  },
  { 
    name: "Terna Engineering College, Navi Mumbai", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 72.0, 
    cetCutoff: 72.0,
    jeeCutoff: 68.0,
    branches: ["Computer Engineering", "IT", "Electronics", "Mechatronics"],
    regions: ["Navi Mumbai", "Nerul"], 
    website: "https://ternaengg.ac.in" 
  },
  { 
    name: "AC Patil College of Engineering, Navi Mumbai", 
    tier: 4, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 55.0, 
    cetCutoff: 55.0,
    jeeCutoff: 50.0,
    branches: ["Computer Engineering", "IT", "Electrical", "Electronics"],
    regions: ["Navi Mumbai", "Kharghar"], 
    website: "https://acpce.org" 
  },
  { 
    name: "Datta Meghe College of Engineering, Airoli", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 78.0, 
    cetCutoff: 78.0,
    branches: ["Computer Engineering", "IT", "Chemical", "Civil"],
    regions: ["Navi Mumbai", "Airoli"], 
    website: "https://dmce.ac.in" 
  },
  { 
    name: "Jawahar Education Society's AC Patil, Navi Mumbai", 
    tier: 4, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 45.0, 
    cetCutoff: 45.0,
    branches: ["Mechanical", "Civil", "Electrical"],
    regions: ["Navi Mumbai"], 
    website: "https://acpce.org" 
  },
  { 
    name: "G.H. Raisoni College of Engineering, Nagpur", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 82.0, 
    cetCutoff: 82.0,
    branches: ["Computer Science", "IT", "AI & ML", "Data Science"],
    regions: ["Nagpur"], 
    website: "https://ghrce.raisoni.net" 
  },
  { 
    name: "Priyadarshini College of Engineering, Nagpur", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 75.0, 
    cetCutoff: 75.0,
    branches: ["Computer Technology", "IT", "Mechanical", "Electrical"],
    regions: ["Nagpur"], 
    website: "https://pcenagpur.edu.in" 
  },
  { 
    name: "Anjuman College of Engineering & Technology, Nagpur", 
    tier: 4, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 58.0, 
    cetCutoff: 58.0,
    branches: ["Computer Science", "Mechanical", "Civil", "Electrical"],
    regions: ["Nagpur"], 
    website: "https://anjumanengg.edu.in" 
  },
  { 
    name: "Smt. Kashibai Navale College of Engineering, Pune", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 85.0, 
    cetCutoff: 85.0,
    branches: ["Computer Engineering", "IT", "Mechanical", "E&TC"],
    regions: ["Pune", "Vadgaon"], 
    website: "https://sinhgad.edu" 
  },
  { 
    name: "Sinhgad Academy of Engineering, Kondhwa, Pune", 
    tier: 4, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 62.0, 
    cetCutoff: 62.0,
    branches: ["Computer Engineering", "IT", "Mechanical", "Civil"],
    regions: ["Pune", "Kondhwa"], 
    website: "https://sinhgad.edu" 
  },
  { 
    name: "JSPM's Rajarshi Shahu College of Engineering, Pune", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 88.0, 
    cetCutoff: 88.0,
    branches: ["Computer Engineering", "IT", "Mechanical", "Civil"],
    regions: ["Pune", "Tathawade"], 
    website: "https://jspmrsce.edu.in" 
  },
  { 
    name: "Dhole Patil College of Engineering, Pune", 
    tier: 4, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 48.0, 
    cetCutoff: 48.0,
    branches: ["Computer Engineering", "IT", "Mechanical", "Automobile"],
    regions: ["Pune", "Wagholi"], 
    website: "https://dpcoepune.edu.in" 
  },
  { 
    name: "Sandip University, Nashik", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 70.0, 
    cetCutoff: 70.0,
    branches: ["Computer Science", "IT", "AI", "Mechanical"],
    regions: ["Nashik"], 
    website: "https://sandipuniversity.edu.in" 
  },
  { 
    name: "Gokhale Education Society's Engineering College, Nashik", 
    tier: 4, 
    type: "Engineering", 
    exam: "MHT-CET", 
    cutoff: 52.0, 
    cetCutoff: 52.0,
    branches: ["Computer Engineering", "Mechanical", "Electrical"],
    regions: ["Nashik"], 
    website: "https://ges-coengg.org" 
  },
  // --- Tier 3 & 4 Polytechnic (Lower Percentile) ---
  { 
    name: "Vidyalankar Polytechnic, Mumbai", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 75.0, 
    regions: ["Mumbai", "Wadala"], 
    website: "https://vpt.edu.in" 
  },
  { 
    name: "Thakur Polytechnic, Mumbai", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 70.0, 
    regions: ["Mumbai", "Kandivali"], 
    website: "https://tpoly.in" 
  },
  { 
    name: "K. J. Somaiya Polytechnic, Mumbai", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 82.0, 
    regions: ["Mumbai", "Vidyavihar"], 
    website: "https://polytechnic.somaiya.edu" 
  },
  { 
    name: "M.H. Saboo Siddik Polytechnic, Mumbai", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 65.0, 
    regions: ["Mumbai", "Byculla"], 
    website: "https://mhssp.org" 
  },
  { 
    name: "Navjeevan Education Society's Polytechnic, Mumbai", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 45.0, 
    regions: ["Mumbai", "Bhandup"], 
    website: "https://nespolytechnic.edu.in" 
  },
  { 
    name: "Marathwada Mitra Mandal's Polytechnic, Pune", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 62.0, 
    regions: ["Pune", "Thergaon"], 
    website: "https://mmpolytechnic.com" 
  },
  { 
    name: "Dr. D. Y. Patil Polytechnic, Pune", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 68.0, 
    regions: ["Pune", "Pimpri"], 
    website: "https://dypvp.edu.in" 
  },
  { 
    name: "Abhinav Education Society's Polytechnic, Pune", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 40.0, 
    regions: ["Pune", "Ambegaon"], 
    website: "https://abhinavpolytechnic.org" 
  },
  { 
    name: "Sou. Venutai Chavan Polytechnic, Pune", 
    tier: "Diploma", 
    type: "Polytechnic", 
    exam: "SSC", 
    cutoff: 55.0, 
    regions: ["Pune", "Vadgaon"], 
    website: "https://sinhgad.edu" 
  },
  { 
    name: "K.J. Somaiya College of Engineering, Mumbai", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    level: "State",
    cutoff: 97.5, 
    cetCutoff: 97.5,
    branches: ["Computer Science", "IT", "Mechanical", "Electronics"],
    regions: ["Mumbai"],
    website: "https://kjsce.somaiya.edu",
    description: "A well-known private engineering college with a beautiful campus in Vidyavihar.",
    placements: {
      avgPackage: "7.5 LPA",
      highestPackage: "40.0 LPA",
      recruiters: ["Accenture", "TCS", "Infosys", "Capgemini"]
    }
  },
  { 
    name: "Thadomal Shahani Engineering College (TSEC), Mumbai", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    level: "State",
    cutoff: 96.8, 
    cetCutoff: 96.8,
    branches: ["Computer Science", "IT", "Chemical", "Electronics"],
    regions: ["Mumbai"],
    website: "https://tsec.edu",
    description: "Located in Bandra, known for its strong placements in the IT sector.",
    placements: {
      avgPackage: "7.0 LPA",
      highestPackage: "38.0 LPA",
      recruiters: ["JPMC", "Barclays", "Oracle", "TCS"]
    }
  },
  { 
    name: "Government College of Engineering, Aurangabad", 
    tier: 2, 
    type: "Engineering", 
    exam: "MHT-CET", 
    level: "State",
    cutoff: 95.5, 
    cetCutoff: 95.5,
    branches: ["Computer Science", "IT", "Mechanical", "Electrical"],
    regions: ["Aurangabad", "Marathwada"],
    website: "https://geca.ac.in",
    description: "A premier government institute in the Marathwada region.",
    placements: {
      avgPackage: "5.5 LPA",
      highestPackage: "15.0 LPA",
      recruiters: ["TCS", "Infosys", "Wipro", "L&T"]
    }
  },
  { 
    name: "Rajarambapu Institute of Technology (RIT), Islampur", 
    tier: 3, 
    type: "Engineering", 
    exam: "MHT-CET", 
    level: "State",
    cutoff: 85.0, 
    cetCutoff: 85.0,
    branches: ["Computer Science", "Mechanical", "Civil", "Electrical"],
    regions: ["Sangli", "Islampur"],
    website: "https://ritindia.edu",
    description: "A leading private engineering college in rural Maharashtra with good infrastructure.",
    placements: {
      avgPackage: "4.2 LPA",
      highestPackage: "12.0 LPA",
      recruiters: ["TCS", "Wipro", "Cognizant"]
    }
  }
];
