import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';
import {SearchList} from '../search-list';

@Component({
  templateUrl: 'build/pages/product/select-auktionator.html'
})
export class SelectAuktionatorPage extends SearchList {
  static get parameters() {
    return [[ViewController], [UserService]];
  }

  constructor(viewCtrl, userService) {
    super();

    this.viewCtrl = viewCtrl;
    this.userService = userService;
  }

  dismiss(auktionator = null) {
    this.viewCtrl.dismiss(auktionator);
  }

  delegateLoad(keyword, page, research = false) {
    return this.userService.searchAuktionators(keyword, page);
  }
}
