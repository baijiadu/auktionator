
export class Page {
  get user() {
    return this.userService && this.userService.currentUser;
  }

  set user(user) {
    if (this.userService) {
      this.userService.currentUser = user;
    }
  }
}
