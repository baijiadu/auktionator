import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, Config} from '../../util/index';
import {UserService} from '../../providers/index';
import {SearchList} from '../search-list';

@Component({
  templateUrl: 'build/pages/product/select-auktionator.html'
})
export class SelectAuktionatorPage extends SearchList {
  constructor(private viewCtrl: ViewController, private userService: UserService) {
    super();
  }

  dismiss(auktionator = null) {
    this.viewCtrl.dismiss(auktionator);
  }

  delegateLoad(keyword, page, research = false) {
    return this.userService.searchAuktionators(keyword, page);
  }
}
