import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import {UserService} from '../../providers/user/user.service';

@Component({
  templateUrl: 'build/pages/my/be-seller.html',
})
export class BeSellerPage {
  static get parameters() {
    return [[NavController], [UserService]];
  }

  constructor(nav, userService) {
    this.nav = nav;
    this.userService = userService;

    this.user = this.userService.currentUser;
  }

  approve() {
    this.userService.beSeller().then(
      user => this.nav.pop(),
      err => Mixins.toastAPIError(err));
  }
}
