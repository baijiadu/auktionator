import {ViewChild, Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

import {Mixins} from '../../util/index';
import {UserService} from '../../providers/index';
import {HomePage, FavoritePage, DiscoveryPage, MyPage} from '../../pages/index';
import {Page} from '../page';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage extends Page {
  static HOME_TAB_INDEX: number = 0;
  static FAVORITE_TAB_INDEX: number = 1;
  static MY_TAB_INDEX: number = 3;

  @ViewChild('mainTabs') mainTabs: any;

  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;

  constructor(nav: NavController, userService: UserService, private events: Events) {
    super(nav, userService);

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


