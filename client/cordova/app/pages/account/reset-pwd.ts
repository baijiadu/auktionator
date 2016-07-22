import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/account/reset-pwd.html',
})
export class ResetPwdPage {
  resetPwd: any;

  constructor(private nav: NavController, private viewCtrl: ViewController) {
    this.resetPwd = {};
  }

  dismiss(data = null) {
    this.viewCtrl.dismiss(data);
  }
}
