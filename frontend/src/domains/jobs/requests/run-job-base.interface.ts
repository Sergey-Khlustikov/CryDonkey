import type { IBaseJobProfile } from '@crydonkey/shared';

export interface IRunJobBase {
  profiles: IBaseJobProfile[];
  minDelayMinutes: number;
  maxDelayMinutes: number;
  keepOpenProfileIds: string[];
}
