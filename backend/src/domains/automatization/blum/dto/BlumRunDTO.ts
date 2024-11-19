import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import IBlumOptions from "#src/domains/automatization/blum/interfaces/IBlumOptions.js";

interface BlumRunDTOParams {
  profiles: IBaseJobProfile[];
  minDelayMinutes: number;
  maxDelayMinutes: number;
  keepOpenProfileIds: string[];
  options: IBlumOptions,
}

class BlumRunDTO {
  private readonly profiles: IBaseJobProfile[];
  private readonly minDelayMinutes: number;
  private readonly maxDelayMinutes: number;
  private readonly keepOpenProfileIds: string[];
  private readonly options: IBlumOptions;

  constructor(dtoOptions: BlumRunDTOParams) {
    this.profiles = dtoOptions.profiles;
    this.minDelayMinutes = dtoOptions.minDelayMinutes;
    this.maxDelayMinutes = dtoOptions.maxDelayMinutes;
    this.keepOpenProfileIds = dtoOptions.keepOpenProfileIds;
    this.options = dtoOptions.options;
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

  getOptions(): IBlumOptions {
    return this.options;
  }
}

export default BlumRunDTO;
