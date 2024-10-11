class BaseDTO {
  getProperties() {
    return Object.keys(this).reduce((acc, key) => {
      acc[key] = this[key];
      return acc;
    }, {});
  }
}

export default BaseDTO;
