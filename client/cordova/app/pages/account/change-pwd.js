import {Page, NavController, ViewController} from 'ionic-angular';

@Page({
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
