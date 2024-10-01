class BlumRunDTO {
  constructor({
    profiles,
    minDelayMinutes,
    maxDelayMinutes,
    keepOpenProfileIds,
  } = {}) {
    this.profiles = profiles;
    this.minDelayMinutes = minDelayMinutes;
    this.maxDelayMinutes = maxDelayMinutes;
    this.keepOpenProfileIds = keepOpenProfileIds;
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
}

export default BlumRunDTO;
