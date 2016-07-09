import {ViewChild, Component} from '@angular/core';
import {NavController, Events, Modal} from 'ionic-angular';

import Mixins from '../../mixins';
import {HomePage} from '../home/home';
import {FavoritePage} from '../favorite/favorite';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';
import {LoginPage} from '../account/login';
import {AkProductsPage} from '../product/ak-products';
import {OwnerProductsPage} from '../product/owner-products';

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
    this.tab2Root = FavoritePage;
    this.tab3Root = DiscoveryPage;
    this.tab4Root = MyPage;

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
      this.mainTabs.select(TabsPage.HOME_TAB_INDEX);
      // 清除
      [TabsPage.FAVORITE_TAB_INDEX, TabsPage.MY_TAB_INDEX].forEach(index => {
        const tab = this.mainTabs.getByIndex(index);
        const length = tab.length();

        if (length > 1) {
          tab.popToRoot();
        }
      });

      this.userService.currentUser = null;
    });

    this.events.subscribe('openNotification', (data) => {
      const {extras} = data[0];

      switch (extras.code) {
        case '100': // 拍卖师收到拍品审核请求
        case '106': // 拍卖师收到拍品审核请求
          this.mainTabs.select(TabsPage.MY_TAB_INDEX);
          setTimeout(() => {
            const statusNames = {'100':  'pending', '106':  'ended'};
            const statusName = statusNames[extras.code];
            const tab = this.mainTabs.getByIndex(TabsPage.MY_TAB_INDEX);

            if (tab.length() > 1) {
              tab.popToRoot().then(() => tab.push(AkProductsPage, {statusName: statusName, notifyProductId: extras.pid}));
            } else {
              tab.push(AkProductsPage, {statusName: statusName, notifyProductId: extras.pid});
            }
          });
          break;
        case '101': // 卖家收到拍品审核通过
        case '102': // 卖家收到拍品审核不通过
        case '103': // 卖家收到拍品被上架
          this.mainTabs.select(TabsPage.MY_TAB_INDEX);
          setTimeout(() => {
            const statusNames = {'101':  'processing', '102':  'ended', '103': 'online'};
            const statusName = statusNames[extras.code];
            const tab = this.mainTabs.getByIndex(TabsPage.MY_TAB_INDEX);

            if (tab.length() > 1) {
              tab.popToRoot().then(() => tab.push(OwnerProductsPage, {statusName: statusName, notifyProductId: extras.pid}));
            } else {
              tab.push(OwnerProductsPage, {statusName: statusName, notifyProductId: extras.pid});
            }
          });
          break;
      }
    });
  }

  favorite() {
    if (!this.userService.currentUser) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (!user) this.mainTabs.select(TabsPage.HOME_TAB_INDEX);
        else this.mainTabs.select(TabsPage.FAVORITE_TAB_INDEX);
      });
    }
  }

  my() {
    if (!this.userService.currentUser) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (!user) this.mainTabs.select(TabsPage.HOME_TAB_INDEX);
        else this.mainTabs.select(TabsPage.MY_TAB_INDEX);
      });
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

TabsPage.HOME_TAB_INDEX = 0;
TabsPage.FAVORITE_TAB_INDEX = 1;
TabsPage.MY_TAB_INDEX = 3;
