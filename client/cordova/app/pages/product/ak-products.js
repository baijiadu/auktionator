import {NavController, NavParams} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {StatusesList} from '../statuses-list';
import Mixins from '../../mixins';

import {Notification} from '../../providers/notification';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

import {ProductDetailPage} from './product-detail';

@Component({
  templateUrl: 'build/pages/product/ak-products.html',
  //queries: {
  //  statusesSlide: new ViewChild('statusesSlide')
  //}
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
      statuses: [1],
    }, {
      name: 'ended',
      statuses: [4, 10, 11, 12],
    }], params.get('statusName'));

    this.nav = nav;
    this.userService = userService;
    this.productService = productService;
    this.notification = notification;

    this.user = this.userService.currentUser;
  }

  delegateLoad(statuses, refresh) {
    const lastOne = this.statusList[this.statusList.length - 1];
    return this.productService.akProducts(this.user.id, statuses, !refresh && lastOne ? lastOne.id : null);
  }

  ionViewDidEnter() {
    // 清除数量
    this.notification.reset('akProductCount');
  }

  auditStatus(slidingItem, product, status) {
    slidingItem.close();

    this.productService.updateAttribute(product.id, {status}).then(p => {
      product.status = p.status;

      if (this.statusName !== 'all') this.statusList.splice(this.statusList.indexOf(product), 1);
    }, err => Mixins.toastAPIError(err));
  }

  showDetail(product) {
    this.nav.push(ProductDetailPage, {product});
  }
}
