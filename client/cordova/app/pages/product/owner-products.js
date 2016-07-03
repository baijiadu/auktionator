import {NavController, NavParams, Modal} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {StatusesList} from '../statuses-list';
import Mixins from '../../mixins';

import {Notification} from '../../providers/notification';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

import {Str2DatePipe} from '../../pipes/str2date';
import {ProductStatusPipe} from '../../pipes/product-status';

import {ProductPublishPage} from './publish';
import {ProductDetailPage} from './product-detail';

@Component({
  templateUrl: 'build/pages/product/owner-products.html',
  //queries: {
  //  statusesSlide: new ViewChild('statusesSlide')
  //},
  pipes: [Str2DatePipe, ProductStatusPipe],
})
export class OwnerProductsPage extends StatusesList {
  static get parameters() {
    return [[NavController], [UserService], [ProductService], [NavParams], [Notification]];
  }

  constructor(nav, userService, productService, params, notification) {
    super([{
      name: 'all',
      statuses: null,
    }, {
      name: 'processing',
      statuses: [0, 1, 2],
    }, {
      name: 'online',
      statuses: [3, 4],
    }, {
      name: 'ended',
      statuses: [5, 10, 11, 12],
    }], params.get('statusName'));

    this.nav = nav;
    this.userService = userService;
    this.productService = productService;
    this.notification = notification;

    this.user = this.userService.currentUser;
  }

  get processingProductCount() {
    return this.notification.ownerProcessingProductCount;
  }

  get onlineProductCount() {
    return this.notification.ownerOnlineProductCount;
  }

  get endedProductCount() {
    return this.notification.ownerEndedProductCount;
  }

  delegateLoad(statuses, page, refresh) {
    return this.productService.ownerProducts(this.user.id, statuses, page);
  }

  editProduct(slidingItem, product) {
    slidingItem.close();

    this.productService.editProduct(product.id).then((p) => {
      let modal = Modal.create(ProductPublishPage, {product: p});
      modal.onDismiss(newProduct => {
        if (newProduct) {
          product = newProduct;
        }
      });
      this.nav.present(modal);
    }, err => Mixins.toastAPIError(err));
  }

  showDetail(product) {
    this.nav.push(ProductDetailPage, {product});
  }

  statusChanged() {
    super.statusChanged();

    switch (this.statusName) {
      case 'processing':
        this.notification.reset('ownerProcessingProductCount');
        break;
      case 'online':
        this.notification.reset('ownerOnlineProductCount');
        break;
      case 'ended':
        this.notification.reset('ownerEndedProductCount');
        break;
    }
  }
}
