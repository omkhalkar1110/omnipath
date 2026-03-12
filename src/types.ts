export interface College {
  name: string;
  tier: number | string;
  type: string;
  exam: string; // Primary exam
  level?: 'State' | 'National';
  cutoff: number; // General cutoff for primary exam
  cetCutoff?: number;
  jeeCutoff?: number;
  jeeAdvancedCutoff?: number;
  lastYearCutoff?: number;
  branches?: string[];
  branchCutoffs?: Record<string, number>;
  minPercentile?: number;
  regions: string[];
  website: string;
  facilities?: string[];
  rankings?: string[];
  description?: string;
  placements?: {
    avgPackage: string;
    highestPackage: string;
    intlPackage?: string;
    recruiters: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface Review {
  id: string;
  collegeName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
