import type { EQueueNames } from '@crydonkey/shared';

export interface IProjectJob {
  id: string;
  name: EQueueNames;
  data: unknown; /*@TODO: Add proper type*/
  progress: number;
  attemptsMade: number;
  finishedOn: number;
  processedOn: number;
  failedReason: string;
  timestamp: number;
  status: string;
}
