import IIdaoProfile from "#src/domains/automatization/idao/interfaces/IIdaoProfile.js";
import IJobBulk from "#src/domains/queues/interfaces/IJobBulk.js";
import IIdaoForecastOptions from "#src/domains/automatization/idao/interfaces/IIdaoForecastOptions.js";

interface IIdaoJobOptions extends IJobBulk<{
  profile: IIdaoProfile,
  keepOpenProfileIds: string[]
  forecastOptions: IIdaoForecastOptions
}> {
}

export default IIdaoJobOptions;
