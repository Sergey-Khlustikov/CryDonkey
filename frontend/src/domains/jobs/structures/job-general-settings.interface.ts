export interface IGeneralJobSettings {
  keepOpenProfileIds: string[];
  minDelayMinutes: number;
  maxDelayMinutes: number;
}

export function createDefaultGeneralJobSettings(): IGeneralJobSettings {
  return {
    keepOpenProfileIds: [],
    minDelayMinutes: 2,
    maxDelayMinutes: 7,
  };
}
