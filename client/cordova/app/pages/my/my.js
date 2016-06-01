import {Page, NavController} from 'ionic-angular';

import {UserService} from '../../providers/user/user.service';
import {SettingsPage} from '../settings/settings';
import {BeSellerPage} from './be-seller';
import {BeAuktionatorPage} from './be-auktionator';

@Page({
  templateUrl: 'build/pages/my/my.html',
})
export class MyPage {
  static get parameters() {
    return [[NavController], [UserService]];
  }

  constructor(nav, userService) {
    this.nav = nav;
    this.userService = userService;

    this.user = this.userService.currentUser;

    this.settingsPage = SettingsPage;
    this.beSellerPage = BeSellerPage;
    this.beAuktionatorPage = BeAuktionatorPage;
  }
}
