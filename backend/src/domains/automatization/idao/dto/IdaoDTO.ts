import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import IIdaoForecastOptions from "#src/domains/automatization/idao/interfaces/IIdaoForecastOptions.js";

interface IdaoDTOOptions {
  profiles: IBaseJobProfile[];
  minDelayMinutes: number;
  maxDelayMinutes: number;
  keepOpenProfileIds: string[];
  forecastOptions: IIdaoForecastOptions;
}

class IdaoDTO {
  private readonly profiles: IBaseJobProfile[];
  private readonly minDelayMinutes: number;
  private readonly maxDelayMinutes: number;
  private readonly keepOpenProfileIds: string[];
  private readonly forecastOptions: IIdaoForecastOptions

  constructor(options: IdaoDTOOptions) {
    this.profiles = options.profiles;
    this.minDelayMinutes = options.minDelayMinutes;
    this.maxDelayMinutes = options.maxDelayMinutes;
    this.keepOpenProfileIds = options.keepOpenProfileIds;

    const defaultForecastOptions: IIdaoForecastOptions = {
      minTargetPriceDeviation: 0,
      maxTargetPriceDeviation: 1,
    };

    this.forecastOptions = {...defaultForecastOptions, ...options.forecastOptions};
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

  getForecastOptions(): IIdaoForecastOptions {
    return this.forecastOptions;
  }
}

export default IdaoDTO;
