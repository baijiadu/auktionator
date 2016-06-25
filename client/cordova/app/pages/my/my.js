import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import {UserService} from '../../providers/user/user.service';
import {Notification} from '../../providers/notification';

import {SettingsPage} from '../settings/settings';
import {BeSellerPage} from './be-seller';
import {BeAuktionatorPage} from './be-auktionator';
import {ProductPublishPage} from '../product/publish';
import {OwnerProductsPage} from '../product/owner-products';
import {AkProductsPage} from '../product/ak-products';
import {ManageUsersPage} from '../admin/manage-users';

@Component({
  templateUrl: 'build/pages/my/my.html',
})
export class MyPage {
  static get parameters() {
    return [[NavController], [UserService], [Notification]];
  }

  constructor(nav, userService, notification) {
    this.nav = nav;
    this.userService = userService;
    this.notification = notification;

    this.settingsPage = SettingsPage;
    this.beSellerPage = BeSellerPage;
    this.beAuktionatorPage = BeAuktionatorPage;

    // 卖家
    this.productPublishPage = ProductPublishPage;
    this.ownerProductsPage = OwnerProductsPage;
    this.akProductsPage = AkProductsPage;
    this.manageUsersPage = ManageUsersPage;
  }

  get user() {
    return this.userService.currentUser;
  }
}
