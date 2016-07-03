import {NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

@Component({
  templateUrl: 'build/pages/game/select-cover.html',
})
export class SelectCoverPage {
  static get parameters() {
    return [[NavParams], [ViewController], ProductService];
  }

  constructor(params, viewCtrl, productService) {
    this.viewCtrl = viewCtrl;
    this.productService = productService;
    this.ids = params.get('ids');

    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    this.productService.queryProductsImagesByIds(this.ids).then(products => {
      this.products.push.apply(this.products, products);
    }, err => Mixins.toastAPIError(err));
  }

  dismiss(cover = null) {
    this.viewCtrl.dismiss(cover);
  }
}
