class TwitterPostDTO {
  constructor({
    profiles,
    minDelayMinutes,
    maxDelayMinutes,
    keepOpenProfileIds,
    automationType,
    posts,
  } = {}) {
    this.profiles = profiles;
    this.minDelayMinutes = minDelayMinutes;
    this.maxDelayMinutes = maxDelayMinutes;
    this.keepOpenProfileIds = keepOpenProfileIds;
    this.automationType = automationType;
    this.posts = posts;
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

  getKeepOpenProfileIds() {
    return this.keepOpenProfileIds;
  }

  getAutomationType() {
    return this.automationType;
  }

  getPosts() {
    return this.posts;
  }
}

export default TwitterPostDTO;
