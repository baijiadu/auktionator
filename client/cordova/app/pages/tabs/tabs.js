import {ViewChild, Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

import Mixins from '../../mixins';

import {Page} from '../page';
import {HomePage} from '../home/home';
import {FavoritePage} from '../favorite/favorite';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';

import {UserService} from '../../providers/user/user.service';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  queries: {
    mainTabs: new ViewChild('mainTabs')
  }
})
export class TabsPage extends Page {
  static get parameters() {
    return [[NavController], [UserService], [Events]];
  }

  constructor(nav, userService, events) {
    super();

    this.nav = nav;
    this.userService = userService;
    this.events = events;

    this.tab1Root = HomePage;
    this.tab2Root = FavoritePage;
    this.tab3Root = DiscoveryPage;
    this.tab4Root = MyPage;
  }

  ionViewLoaded() {
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

      this.user = null;
    });
  }

  favorite() {
    if (!this.user) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (!user) this.mainTabs.select(TabsPage.HOME_TAB_INDEX);
        else this.mainTabs.select(TabsPage.FAVORITE_TAB_INDEX);
      });
    }
  }

  my() {
    if (!this.user) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (!user) this.mainTabs.select(TabsPage.HOME_TAB_INDEX);
        else this.mainTabs.select(TabsPage.MY_TAB_INDEX);
      });
    }
  }
}

TabsPage.HOME_TAB_INDEX = 0;
TabsPage.FAVORITE_TAB_INDEX = 1;
TabsPage.MY_TAB_INDEX = 3;
