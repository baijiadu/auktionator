import {Page, NavController, ViewController, Modal} from 'ionic-angular';

import {ForgetPwdPage} from './forget-pwd';

@Page({
  templateUrl: 'build/pages/account/login.html',
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [ViewController]];
  }

  constructor(nav, viewCtrl) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.actionType = 'login';
    this.login = {};
    this.register = {};
    this.verifyCodeProcessing = false;
  }

  forgetPwd() {
    let modal = Modal.create(ForgetPwdPage);
    modal.onDismiss(user => {
      // TODO
    });
    this.nav.present(modal);
  }

  dismiss(user = null) {
    this.viewCtrl.dismiss(user);
  }

  login() {

  }

  register() {

  }
}
