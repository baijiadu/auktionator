import {NavController, Modal, Events} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import {UserService} from '../../providers/user/user.service';
import {Notification} from '../../providers/notification';

import {SettingsPage} from '../settings/settings';
import {BeSellerPage} from './be-seller';
import {BeAuktionatorPage} from './be-auktionator';
import {ProductPublishPage} from '../product/publish';
import {OwnerProductsPage} from '../product/owner-products';
import {AkProductsPage} from '../product/ak-products';
import {ManageUsersPage} from '../admin/manage-users';
import {GamePublishPage} from '../game/publish';
import {AkGamesPage} from '../game/ak-games';

@Component({
  templateUrl: 'build/pages/my/my.html',
})
export class MyPage {
  static get parameters() {
    return [[NavController], [UserService], [Notification], [Events]];
  }

  constructor(nav, userService, notification, events) {
    this.nav = nav;
    this.userService = userService;
    this.notification = notification;
    this.events = events;

    this.settingsPage = SettingsPage;
    this.beSellerPage = BeSellerPage;
    this.beAuktionatorPage = BeAuktionatorPage;

    // 卖家
    this.productPublishPage = ProductPublishPage;
    this.ownerProductsPage = OwnerProductsPage;

    // 拍卖师
    this.akProductsPage = AkProductsPage;
    this.gamePublishPage = GamePublishPage;
    this.akGamesPage = AkGamesPage;

    // 管理员
    this.manageUsersPage = ManageUsersPage;
  }

  get user() {
    return this.userService.currentUser;
  }

  get ownerProductCount() {
    return this.notification.ownerProcessingProductCount + this.notification.ownerOnlineProductCount + this.notification.ownerEndedProductCount;
  }

  get akProductCount() {
    return this.notification.akPendingProductCount;
  }

  showPublishPage() {
    let modal = Modal.create(ProductPublishPage);
    modal.onDismiss(product => {
      if (product) {
        this.events.publish('product:created', product);
        this.nav.push(OwnerProductsPage, {statusName: 'processing'});
        Mixins.toast('拍品发布成功，请耐心等待拍卖师的审核');
      }
    });
    this.nav.present(modal);
  }

  showGamePublishPage() {
    let modal = Modal.create(GamePublishPage);
    modal.onDismiss(game => {
      if (game) {
        this.events.publish('game:created', game);
        this.nav.push(AkGamesPage, {statusName: 'pending'});
        Mixins.toast('拍场发布成功');
      }
    });
    this.nav.present(modal);
  }
}
