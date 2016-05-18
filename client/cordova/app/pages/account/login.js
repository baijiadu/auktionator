import {Page, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/account/login.html',
})
export class AccountPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
