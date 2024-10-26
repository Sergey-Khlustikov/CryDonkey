// @ts-nocheck
import BaseDTO from "#src/helpers/BaseDTO.js";

class TwitterAccountDTO extends BaseDTO {
  constructor({email, username, password}) {
    super();
    this.email = email;
    this.username = username;
    this.password = password;
  }

  getEmail() {
    return this.email;
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }
}

export default TwitterAccountDTO;
