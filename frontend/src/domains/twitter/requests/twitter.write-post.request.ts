import type { IRunJobBase } from 'src/domains/jobs/requests/run-job-base.interface.js';
import type { ITwitterPostSettings } from 'src/domains/twitter/structures/twitter-post-settings.interface.js';

export interface RTwitterWritePost extends IRunJobBase, ITwitterPostSettings {
}
