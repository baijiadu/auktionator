import {NavController, NavParams, Alert, Modal} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {StatusesList} from '../statuses-list';
import Mixins from '../../mixins';

import {Notification} from '../../providers/notification';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

import {Str2DatePipe} from '../../pipes/str2date';
import {ProductStatusPipe} from '../../pipes/product-status';

import {ProductDetailPage} from './product-detail';
import {SelectGamePage} from './select-game';

@Component({
  templateUrl: 'build/pages/product/ak-products.html',
  //queries: {
  //  statusesSlide: new ViewChild('statusesSlide')
  //},
  pipes: [Str2DatePipe, ProductStatusPipe],
})
export class AkProductsPage extends StatusesList {
  static get parameters() {
    return [[NavController], [UserService], [ProductService], [NavParams], [Notification]];
  }

  constructor(nav, userService, productService, params, notification) {
    super([{
      name: 'all',
      statuses: null,
    }, {
      name: 'pending',
      statuses: [0],
    }, {
      name: 'online',
      statuses: [1, 2, 6],
    }, {
      name: 'ended',
      statuses: [5, 10, 11, 12, 14],
    }], params.get('statusName'));

    this.nav = nav;
    this.userService = userService;
    this.productService = productService;
    this.notification = notification;
  }

  get user() {
    return this.userService.currentUser;
  }

  get pendingProductCount() {
    return this.notification.akPendingProductCount;
  }

  delegateLoad(statuses, page, refresh) {
    return this.productService.akProducts(this.user.id, statuses, page);
  }

  confirmItem(slidingItem, product) {
    this.updateStatus(slidingItem, product, 1);
  }

  rejectItem(slidingItem, product) {
    this.nav.present(Alert.create({
      title: '拍品拒绝确认',
      message: '您确定要拒绝该拍品吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: '确定',
          handler: () => {
            this.updateStatus(slidingItem, product, 10);
          }
        }
      ]
    }));
  }

  selectGame(slidingItem, product, isSwitch = false) {
    slidingItem.close();

    let modal = Modal.create(SelectGamePage, {currentGameId: product.gameId});
    modal.onDismiss(game => {
      if (game && game.id !== product.gameId) {
        let promise = isSwitch
          ? this.productService.switchGame(product.id, game.id)
          : this.productService.addIntoGame(product.id, game.id);

        promise.then(p => {
          product.status = 2;
          product.gameId = game.id;
          Mixins.toast('处理成功');
        }, err => Mixins.toastAPIError(err));
      }
    });
    this.nav.present(modal);
  }

  updateStatus(slidingItem, product, status) {
    slidingItem.close();

    this.productService.updateAttribute(product.id, {status}).then(p => {
      product.status = p.status;

      if (this.statusName !== 'all') this.statusList.splice(this.statusList.indexOf(product), 1);
      Mixins.toast('处理成功');
    }, err => Mixins.toastAPIError(err));
  }

  showDetail(product) {
    this.nav.push(ProductDetailPage, {product});
  }

  statusChanged() {
    super.statusChanged();

    switch (this.statusName) {
      case 'pending':
        this.notification.reset('akPendingProductCount');
        break;
      case 'online':
        //this.notification.reset('akOnlineProductCount');
        break;
      case 'ended':
        //this.notification.reset('akEndedProductCount');
        break;
    }
  }
}
