import type { ETwitterPostAutomationTypes } from 'src/domains/twitter/structures/twitter-post-automation-types.enum.js';
import type { ITwitterPost } from 'src/domains/twitter/structures/twitter-post.interface.js';

export interface ITwitterPostSettings {
  posts: ITwitterPost[];
  automationType: ETwitterPostAutomationTypes;
}
