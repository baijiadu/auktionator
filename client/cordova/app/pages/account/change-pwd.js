import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/account/change-pwd.html',
})
export class ChangePwdPage {
  static get parameters() {
    return [[NavController], [ViewController]];
  }

  constructor(nav, viewCtrl) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.account = {};
  }

  dismiss(user = null) {
    this.viewCtrl.dismiss(user);
  }
}
