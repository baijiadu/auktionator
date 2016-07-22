import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/account/forget-pwd.html',
})
export class ForgetPwdPage {
  forgetPwd: any;
  verifyCodeProcessing: any;
  verifyCodeInterval: any;

  constructor(private nav: NavController, private viewCtrl: ViewController) {
    this.forgetPwd = {};
    this.verifyCodeProcessing = null;
    this.verifyCodeInterval = null;
  }

  ionViewWillUnload() {
    if (this.verifyCodeInterval) clearInterval(this.verifyCodeInterval);
  }

  dismiss(data = null) {
    this.viewCtrl.dismiss(data);
  }
}
