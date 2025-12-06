// src/demo-data/hcpSummary.ts
export type DemoHcpSummary = {
  id: string;
  name: string;
  targetHours: number;
  completedHours: number;
  inProgressHours: number;
};

export const demoHcpSummary: DemoHcpSummary = {
  id: 'hcp-1',
  name: '. ',
  targetHours: 40,
  completedHours: 18,
  inProgressHours: 6,
};
