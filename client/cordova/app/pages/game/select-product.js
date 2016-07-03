import {NavController, ViewController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';
import {SearchList} from '../search-list';

@Component({
  templateUrl: 'build/pages/game/select-product.html'
})
export class SelectProductPage extends SearchList {
  static get parameters() {
    return [[ViewController], [UserService], [ProductService], [NavParams]];
  }

  constructor(viewCtrl, userService, productService, params) {
    super();
    this.viewCtrl = viewCtrl;
    this.userService = userService;
    this.productService = productService;

    this.selected = params.get('selected') || [];
    this.checkedList = [];
  }

  get user() {
    return this.userService.currentUser;
  }

  dismiss(checkedList = null) {
    this.viewCtrl.dismiss(checkedList);
  }

  checkChanged(checkbox, item) {
    if (checkbox.checked) {
      this.checkedList.push(item);
    } else {
      this.checkedList.splice(this.checkedList.indexOf(item), 1);
    }
    console.log(this.checkedList);
  }

  delegateLoad(keyword, page, research = false) {
    return this.productService.searchAkCheckedProducts(this.user.id, this.selected, keyword, page);
  }
}
