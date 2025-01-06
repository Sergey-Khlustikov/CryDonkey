import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import IJobBulk from "#src/domains/queues/structures/interfaces/IJobBulk.js";
import IIdaoForecastOptions from "#src/domains/automatization/idao/interfaces/IIdaoForecastOptions.js";

interface IIdaoJobOptions extends IJobBulk<{
  profile: IBaseJobProfile,
  userId: string,
  keepOpenProfileIds: string[]
  forecastOptions: IIdaoForecastOptions
}> {
}

export default IIdaoJobOptions;
