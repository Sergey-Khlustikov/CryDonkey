import type { IRunJobBase } from 'src/domains/jobs/requests/run-job-base.interface.js';
import type { IIdaoRunSettings } from 'src/domains/projects/idao/structures/idao.run-settings.interface.js';

export interface RIdaoRun extends IRunJobBase, IIdaoRunSettings {

}
