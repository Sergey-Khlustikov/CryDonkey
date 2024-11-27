import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";

interface PeaqDTOOptions {
  profiles: IBaseJobProfile[];
  minDelayMinutes: number;
  maxDelayMinutes: number;
  keepOpenProfileIds: string[];
  part: string;
}

class PeaqDTO {
  private readonly profiles: IBaseJobProfile[];
  private readonly minDelayMinutes: number;
  private readonly maxDelayMinutes: number;
  private readonly keepOpenProfileIds: string[];
  private readonly part: string;

  constructor(options: PeaqDTOOptions) {
    this.profiles = options.profiles;
    this.minDelayMinutes = options.minDelayMinutes;
    this.maxDelayMinutes = options.maxDelayMinutes;
    this.keepOpenProfileIds = options.keepOpenProfileIds;
    this.part = options.part;
  }

  getProfiles(): IBaseJobProfile[] {
    return this.profiles;
  }

  getMinDelayMinutes(): number {
    return this.minDelayMinutes;
  }

  getMaxDelayMinutes(): number {
    return this.maxDelayMinutes;
  }

  getKeepOpenProfileIds(): string[] {
    return this.keepOpenProfileIds;
  }

  getPart(): string {
    return this.part;
  }
}

export default PeaqDTO;
