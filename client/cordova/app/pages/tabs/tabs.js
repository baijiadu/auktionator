import {ViewChild, Component} from '@angular/core';
import {NavController, Events, Modal} from 'ionic-angular';

import Mixins from '../../mixins';
import {HomePage} from '../home/home';
import {FavoritePage} from '../favorite/favorite';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';
import {LoginPage} from '../account/login';

import {UserService} from '../../providers/user/user.service';
import AKStorage from '../../ak-storage';

@Component({
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

  ionViewLoaded() {
    // 用户进入APP自动登陆
    AKStorage.loadCurrentUser().then(user => {
      if (user && user.tel) this.userService.autoLogin(user.tel);
    })

    // 订阅用户登录的事件
    this.events.subscribe('user:login', (data) => {
      this.showLoginPage(data && data.length ? data[0] : data);
    });

    // 订阅用户注销的事件
    this.events.subscribe('user:logout', () => {
      this.mainTabs.select(0);
      // 清除
      [1, 3].forEach(index => {
        const tab = this.mainTabs.getByIndex(index);
        const length = tab.length();

        if (length > 0) {
          tab.popToRoot();
          this['tab' + (index + 1) + 'Root'] = null;
        }
      });

      this.userService.currentUser = null;
      AKStorage.saveCurrentUser(null);
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
      setTimeout(() => this.mainTabs.select(1));
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
      setTimeout(() => this.mainTabs.select(3));
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
