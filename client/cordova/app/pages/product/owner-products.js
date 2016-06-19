import {NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

//import {Str2DatePipe} from '../../pipes/str2date';

@Component({
  templateUrl: 'build/pages/product/owner-products.html',
  //pipes: [Str2DatePipe]
})
export class OwnerProductsPage {
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
      case 'processing':
        statuses= [0, 1, 10, 11];
        break;
      case 'online':
        statuses= [2, 3, 10, 11];
        break;
      case 'ended':
        statuses= [4, 12];
        break;
      case 'all':
      default:
        statuses = null;
        break;
    }

    return this.productService.ownerProducts(this.user.id, statuses, sinceId).then(products => {
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
    this.noMore = false;
    this.products = [];
    this.loadProducts();
  }
}
