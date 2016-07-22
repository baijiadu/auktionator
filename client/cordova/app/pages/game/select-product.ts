import {NavController, ViewController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, Config} from '../../util/index';
import {UserService, ProductService} from '../../providers/index';
import {SearchList} from '../search-list';

@Component({
  templateUrl: 'build/pages/game/select-product.html'
})
export class SelectProductPage extends SearchList {
  selected:Array<any>;
  checkedList:Array<any>;

  constructor(private viewCtrl:ViewController, private userService:UserService, private productService:ProductService, private params:NavParams) {
    super();
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

  delegateLoad(keyword, page, research = false): any {
    return this.productService.searchAkCheckedProducts(this.user.id, this.selected, keyword, page);
  }
}
