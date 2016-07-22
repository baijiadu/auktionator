import {NavController, Loading} from 'ionic-angular';
import {UserService} from "../providers/index";

class Page {
  loading: Loading;

  constructor(protected nav: NavController, protected userService: UserService) {
    this.loading = null;
  }
  get user() {
    return this.userService.currentUser;
  }

  set user(user) {
    this.userService.currentUser = user;
  }

  showLoading(content: string) {
    this.loading = Loading.create({
      content,
    });
    return this.nav.present(this.loading);
  }

  dismissLoading() {
    return this.loading && this.loading.dismiss();
  }
}

export {Page};
