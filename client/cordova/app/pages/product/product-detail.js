import {NavController, NavParams} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import Mixins from '../../mixins';
import {GridImg} from '../../components/image/grid-img';

import {Str2DatePipe} from '../../pipes/str2date';
import {ProductStatusPipe} from '../../pipes/product-status';

import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

@Component({
  templateUrl: 'build/pages/product/product-detail.html',
  directives: [GridImg],
  pipes: [Str2DatePipe, ProductStatusPipe],
})
export class ProductDetailPage {
  static get parameters() {
    return [[NavController], [UserService], [ProductService], [NavParams]];
  }

  get user() {
    return this.userService.currentUser;
  }

  constructor(nav, userService, productService, params) {
    this.nav = nav;
    this.userService = userService;
    this.productService = productService;

    this.product = params.get('product');
  }

  ionViewLoaded() {
    this.loadProduct();
  }

  loadProduct() {
    return this.productService.detailProduct(this.product.id).then((product) => {
      this.product = product;
      return product;
    }, err => {
      Mixins.toastAPIError(err);
      return err;
    });
  }

  doRefresh(refresher) {
    this.loadProduct().then(product => refresher.complete(), err => refresher.complete());
  }
}
