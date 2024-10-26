import IIdaoProfile from "#src/domains/automatization/idao/interfaces/IIdaoProfile";
import IJobBulk from "#src/domains/queues/interfaces/IJobBulk";
import IIdaoForecastOptions from "#src/domains/automatization/idao/interfaces/IIdaoForecastOptions";

interface IIdaoJobOptions extends IJobBulk<{
  profile: IIdaoProfile,
  keepOpenProfileIds: string[]
  forecastOptions: IIdaoForecastOptions
}> {
}

export default IIdaoJobOptions;
