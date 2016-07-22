import {NavController, Modal, Events} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {UserService, Notification} from '../../providers/index';
import {SettingsPage, BeSellerPage, BeSellerApplyPage, BeAuktionatorPage,
  ProductPublishPage, OwnerProductsPage, AkProductsPage, ManageUsersPage,
  GamePublishPage, AkGamesPage, BeAuktionatorApplyPage} from '../../pages/index';
import {Page} from '../page';

@Component({
  templateUrl: 'build/pages/my/my.html',
})
export class MyPage extends Page {
  settingsPage: any;
  productPublishPage: any;
  ownerProductsPage: any;
  akProductsPage: any;
  gamePublishPage: any;
  akGamesPage: any;
  manageUsersPage: any;

  constructor(nav: NavController, userService: UserService, private notification: Notification, private events: Events) {
    super(nav, userService);

    this.settingsPage = SettingsPage;

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

  get ownerProductCount() {
    return this.notification.ownerProcessingProductCount + this.notification.ownerOnlineProductCount + this.notification.ownerEndedProductCount;
  }

  get akProductCount() {
    return this.notification.akPendingProductCount;
  }

  showProductPublishPage() {
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

  beSeller() {
    if (this.user.sellerInfo) {
      this.nav.push(BeSellerApplyPage);
    } else {
      this.nav.push(BeSellerPage);
    }
  }

  beAuktionator() {
    if (this.user.akInfo) {
      this.nav.push(BeAuktionatorApplyPage);
    } else {
      this.nav.push(BeAuktionatorPage);
    }
  }

  showGamePublishPage() {
    let modal = Modal.create(GamePublishPage);
    modal.onDismiss(game => {
      if (game) {
        this.events.publish('game:created', game);
        if (game.status === 0) {// 编辑状态
          Mixins.toast('拍场保存成功');
        } else if (game.status === 1) {
          Mixins.toast('拍场发布成功');
        }
        this.nav.push(AkGamesPage, {statusName: 'pending'});
      }
    });
    this.nav.present(modal);
  }
}
