import {NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {UserService, ProductService} from '../../providers/index';

@Component({
  templateUrl: 'build/pages/game/select-cover.html',
})
export class SelectCoverPage {
  ids: Array<any>;
  products: Array<any>;

  constructor(private params: NavParams, private viewCtrl: ViewController, private productService: ProductService) {
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
