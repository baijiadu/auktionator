import {Page, NavController, ViewController, Modal} from 'ionic-angular';

import {UserService} from '../../providers/user/user.service';
import {ForgetPwdPage} from './forget-pwd';

@Page({
  templateUrl: 'build/pages/account/login.html',
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [ViewController], [UserService]];
  }

  constructor(nav, viewCtrl, userService) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.userService = userService;

    this.actionType = 'login';
    this.loginData = {};
    this.registerData = {};
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
    const {account, pwd} = this.loginData;

    this.userService.login(account, pwd)
      .then((user) => {
        console.log('登录成功');
      })
  }

  register() {

  }
}
