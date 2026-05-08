export interface VibeVideo {
  id: string;
  collegeName: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  sourceFootage?: string[]; // URLs to raw footage
  isExternal?: boolean;
}

export interface College {
  id?: string;
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
  fees?: {
    [category: string]: number;
  };
  hostelFees?: number;
  vibeVideos?: VibeVideo[];
  faculty?: {
    name: string;
    designation: string;
    specialization: string;
    image?: string;
  }[];
  researchAreas?: string[];
  notableAlumni?: {
    name: string;
    achievement: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  isPremium: boolean;
  role: 'admin' | 'student' | 'creator';
  isBlocked: boolean;
  collegeName?: string; // For creators
}

export interface Review {
  id: string;
  collegeName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CareerOption {
  name: string;
  path: string;
  intelligence: string;
  jobRoles: string[];
  salaryRange: string;
}

export interface CareerRoadmap {
  title: string;
  options: CareerOption[];
}
