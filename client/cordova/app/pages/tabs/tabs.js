import {ViewChild} from '@angular/core';
import {Page, NavController, Events, Modal} from 'ionic-angular';

import {HomePage} from '../home/home';
import {FavoritePage} from '../favorite/favorite';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';
import {LoginPage} from '../account/login';

import {UserService} from '../../providers/user/user.service';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html',
  queries: {
    mainTabs: new ViewChild('mainTabs')
  }
})
export class TabsPage {

  static get parameters() {
    return [[NavController], [UserService], [Events]];
  }

  constructor(nav, userService, events) {
    this.tab1Root = HomePage;
    this.tab2Root = null;
    this.tab3Root = DiscoveryPage;
    this.tab4Root = null;

    this.nav = nav;
    this.userService = userService;
    this.events = events;
  }

  onPageLoaded() {
    this.events.subscribe('user:login', (data) => {
      this.showLoginPage(data && data.length ? data[0] : data);
    });
  }

  favorite() {
    if (!this.userService.currentUser) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (!user) this.mainTabs.select(0);
        else this.initTab2Page();
      });
    } else {
      this.initTab2Page();
    }
  }

  initTab2Page() {
    if (!this.tab2Root) {
      this.tab2Root = FavoritePage;
      this.mainTabs.select(1);
    }
  }

  my() {
    if (!this.userService.currentUser) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (!user) this.mainTabs.select(0);
        else this.initTab4Page();
      });
    } else {
      this.initTab4Page();
    }
  }

  initTab4Page() {
    if (!this.tab4Root) {
      this.tab4Root = MyPage;
      this.mainTabs.select(3);
    }
  }

  showLoginPage(done) {
    let modal = Modal.create(LoginPage);
    modal.onDismiss(user => {
      // 触发回调函数
      done && done(user);
    });
    this.nav.present(modal);
  }
}
