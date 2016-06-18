import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import {UserService} from '../../providers/user/user.service';

@Component({
  templateUrl: 'build/pages/my/be-auktionator.html',
})
export class BeAuktionatorPage {
  static get parameters() {
    return [[NavController], [UserService]];
  }

  constructor(nav, userService) {
    this.nav = nav;
    this.userService = userService;

    this.user = this.userService.currentUser;
  }
}
