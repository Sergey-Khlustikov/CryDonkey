import IBaseJobProfile from "#src/domains/queues/structures/interfaces/IBaseJobProfile.js";
import IJobBulk from "#src/domains/queues/structures/interfaces/IJobBulk.js";
import IBlumOptions from "#src/domains/automatization/blum/interfaces/IBlumOptions.js";

interface IBlumJobOptions extends IJobBulk<{
  profile: IBaseJobProfile,
  userId: string,
  keepOpenProfileIds: string[]
  options: IBlumOptions
}> {
}

export default IBlumJobOptions;
