import {NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

@Component({
  templateUrl: 'build/pages/product/ak-products.html',
})
export class AkProductsPage {
  static get parameters() {
    return [[NavController], [UserService], [ProductService], [NavParams]];
  }

  constructor(nav, userService, productService, params) {
    this.nav = nav;
    this.userService = userService;
    this.productService = productService;

    this.user = this.userService.currentUser;
    this.products = [];
    this.statusName = params.get('statusName') || 'all';
    this.noMore = false;
  }

  ionViewLoaded() {
    this.loadProducts();
  }

  doInfinite(infiniteScroll) {
    const lastProduct = this.products[this.products.length - 1];

    if (lastProduct) {
      setTimeout(() => {
        this.loadProducts(lastProduct.id).then(
          products => {
            if (products.length >= Config.pageSize) {
              infiniteScroll.complete();
            }
          }, err => infiniteScroll.complete());
      }, 500);
    }
  }

  loadProducts(sinceId = null) {
    let statuses = null;

    switch (this.statusName) {
      case 'pending':
        statuses= [0];
        break;
      case 'online':
        statuses= [1];
        break;
      case 'ended':
        statuses= [4, 10, 11, 12];
        break;
      case 'all':
      default:
        statuses = null;
        break;
    }

    return this.productService.akProducts(this.user.id, statuses, sinceId).then(products => {
      this.products.push.apply(this.products, products);
      if (products.length < Config.pageSize) {
        this.noMore = true;
      }
      return products;
    }, err => {
      Mixins.toastAPIError(err)
      return err;
    });
  }

  statusesChanged(segment) {
    this.noMore = true;
    this.products = [];
    this.loadProducts();
  }
}
