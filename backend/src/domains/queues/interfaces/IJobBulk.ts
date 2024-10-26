import {BulkJobOptions} from "bullmq";

interface IJobBulk<T = any> {
  name: string;
  data: T,
  opts?: BulkJobOptions
}

export default IJobBulk;
