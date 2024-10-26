interface BlumRunDTOParams {
  profiles: string[];
  minDelayMinutes?: number;
  maxDelayMinutes?: number;
  keepOpenProfileIds?: string[];
}

class BlumRunDTO {
  private readonly profiles: string[];
  private readonly minDelayMinutes: number;
  private readonly maxDelayMinutes: number;
  private readonly keepOpenProfileIds?: string[];

  constructor({
    profiles,
    minDelayMinutes = 1,
    maxDelayMinutes = 5,
    keepOpenProfileIds,
  }: BlumRunDTOParams) {
    this.profiles = profiles;
    this.minDelayMinutes = minDelayMinutes;
    this.maxDelayMinutes = maxDelayMinutes;
    this.keepOpenProfileIds = keepOpenProfileIds;
  }

  getProfiles(): string[] {
    return this.profiles;
  }

  getMinDelayMinutes(): number {
    return this.minDelayMinutes;
  }

  getMaxDelayMinutes(): number {
    return this.maxDelayMinutes;
  }

  getKeepOpenProfileIds(): string[] | undefined {
    return this.keepOpenProfileIds;
  }
}

export default BlumRunDTO;
