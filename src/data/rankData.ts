
export interface RankRange {
  minMarks: number;
  maxMarks: number;
  minRank: number;
  maxRank: number;
  percentile?: string;
}

export const JEE_MAIN_2025_DATA: RankRange[] = [
  { minMarks: 280, maxMarks: 300, minRank: 1, maxRank: 100, percentile: "99.99+" },
  { minMarks: 260, maxMarks: 279, minRank: 101, maxRank: 500, percentile: "99.95-99.98" },
  { minMarks: 250, maxMarks: 259, minRank: 501, maxRank: 1000, percentile: "99.90-99.94" },
  { minMarks: 240, maxMarks: 249, minRank: 1001, maxRank: 2000, percentile: "99.80-99.89" },
  { minMarks: 230, maxMarks: 239, minRank: 2001, maxRank: 5000, percentile: "99.50-99.79" },
  { minMarks: 210, maxMarks: 229, minRank: 5001, maxRank: 10000, percentile: "99.00-99.49" },
  { minMarks: 190, maxMarks: 209, minRank: 10001, maxRank: 20000, percentile: "98.00-98.99" },
  { minMarks: 170, maxMarks: 189, minRank: 20001, maxRank: 35000, percentile: "97.00-97.99" },
  { minMarks: 150, maxMarks: 169, minRank: 35001, maxRank: 50000, percentile: "95.00-96.99" },
  { minMarks: 130, maxMarks: 149, minRank: 50001, maxRank: 75000, percentile: "92.00-94.99" },
  { minMarks: 110, maxMarks: 129, minRank: 75001, maxRank: 100000, percentile: "88.00-91.99" },
  { minMarks: 90, maxMarks: 109, minRank: 100001, maxRank: 150000, percentile: "80.00-87.99" },
  { minMarks: 70, maxMarks: 89, minRank: 150001, maxRank: 250000, percentile: "70.00-79.99" },
];

export const MHT_CET_2025_DATA: RankRange[] = [
  { minMarks: 180, maxMarks: 200, minRank: 1, maxRank: 500, percentile: "99.95+" },
  { minMarks: 170, maxMarks: 179, minRank: 501, maxRank: 1500, percentile: "99.80-99.94" },
  { minMarks: 160, maxMarks: 169, minRank: 1501, maxRank: 3000, percentile: "99.50-99.79" },
  { minMarks: 150, maxMarks: 159, minRank: 3001, maxRank: 6000, percentile: "99.00-99.49" },
  { minMarks: 140, maxMarks: 149, minRank: 6001, maxRank: 10000, percentile: "98.00-98.99" },
  { minMarks: 130, maxMarks: 139, minRank: 10001, maxRank: 15000, percentile: "97.00-97.99" },
  { minMarks: 120, maxMarks: 129, minRank: 15001, maxRank: 22000, percentile: "95.00-96.99" },
  { minMarks: 110, maxMarks: 119, minRank: 22001, maxRank: 30000, percentile: "92.00-94.99" },
  { minMarks: 100, maxMarks: 109, minRank: 30001, maxRank: 40000, percentile: "88.00-91.99" },
  { minMarks: 90, maxMarks: 99, minRank: 40001, maxRank: 55000, percentile: "80.00-87.99" },
  { minMarks: 80, maxMarks: 89, minRank: 55001, maxRank: 75000, percentile: "70.00-79.99" },
  { minMarks: 70, maxMarks: 79, minRank: 75001, maxRank: 100000, percentile: "60.00-69.99" },
];
