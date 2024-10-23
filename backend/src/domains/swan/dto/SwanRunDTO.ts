// @ts-nocheck
class SwanRunDTO {
  constructor({
    profiles,
    minDelayMinutes,
    maxDelayMinutes,
    onlyDaily,
    dailyCombo,
    keepOpenProfileIds,
    commentQuests,
    commentAutomationType,
  } = {}) {
    this.profiles = profiles;
    this.minDelayMinutes = minDelayMinutes;
    this.maxDelayMinutes = maxDelayMinutes;
    this.onlyDaily = onlyDaily;
    this.dailyCombo = dailyCombo;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.commentAutomationType = commentAutomationType;
    this.commentQuests = commentQuests;
  }

  getProfiles() {
    return this.profiles;
  }

  getMinDelayMinutes() {
    return this.minDelayMinutes;
  }

  getMaxDelayMinutes() {
    return this.maxDelayMinutes;
  }

  getOnlyDaily() {
    return this.onlyDaily;
  }

  getDailyCombo() {
    return this.dailyCombo;
  }

  getKeepOpenProfileIds() {
    return this.keepOpenProfileIds;
  }

  getCommentAutomationType() {
    return this.commentAutomationType;
  }

  getCommentQuests() {
    return this.commentQuests;
  }

  getCommentQuestsByProfileId(profileId) {
    if (!this.commentQuests) {
      return null;
    }

    return this.commentQuests.map(quest => {
      const filteredComments = quest.comments.filter(comment => comment.profileId === profileId);

      return filteredComments.map(comment => ({
        title: quest.title,
        comment: comment.comment,
      }));
    }).flat();
  }
}

export default SwanRunDTO;
