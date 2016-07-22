import {Splashscreen, StatusBar} from 'ionic-native';
import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav, Events, Modal} from 'ionic-angular';

import {TabsPage, LoginPage, AkProductsPage, OwnerProductsPage} from './pages/index';
import {Config, AKStorage} from './util/index';
import {Notification, UserService} from './providers/index';
import {DIRECTIVES}from './app.directives';
import {PIPES} from './app.pipes';
import {PROVIDERS} from './app.providers';

declare var window;

@Component({
  template: '<ion-nav #nav [root]="rootPage" [swipeBackEnabled]="true"></ion-nav>',
  //prodMode: Config.isProd,
})
export class App {
  rootPage: any;

  @ViewChild('nav') nav: Nav;

  constructor(
    private platform: Platform,
    private events: Events,
    private notification: Notification,
    private userService: UserService
  ) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      // 推送相关
      this.handleJPush();

      // 用户进入APP自动登陆
      AKStorage.load(AKStorage.CURRENT_USER).then(user => {
        // TODO 修改自动登录方式，token验证
        if (user && user.tel) this.userService.autoLogin(user.tel);
      });

      // 订阅用户登录的事件
      this.events.subscribe('user:login', (data) => {
        this.showLoginPage(data && data.length ? data[0] : data);
      });

      // 监听用户打开通知栏的操作
      this.registerOpenNotification();
    });
  }

  handleJPush() {
    if (window.plugins && window.plugins.jPushPlugin) {
      let jPushPlugin = window.plugins.jPushPlugin;
      jPushPlugin.init();
      jPushPlugin.setDebugMode(!Config.isProd);

      // 登陆
      this.events.subscribe('user:logged', (data) => {
        const {id} = data[0];
        jPushPlugin.setAlias('u_' + id);
      });

      // 注销
      this.events.subscribe('user:logout', () => {
        jPushPlugin.setAlias('');
      });

      // 获取注册ID
      jPushPlugin.getRegistrationID(data => {
        console.log('jpush.getRegistrationID', data);
      });

      // 打开通知栏，可用于打开指定页面等等
      document.addEventListener("jpush.openNotification", (event) => {
        let data;

        if(this.platform.is('android')) {
          data = jPushPlugin.openNotification;
        } else if (this.platform.is('ios')) {
          data = event;
        }
        this.events.publish('openNotification', data);
      }, false);

      // 接收到通知消息，可用于增加消息数量等等
      document.addEventListener("jpush.receiveNotification", (event) => {
        let data;

        if(this.platform.is('android')) {
          data = jPushPlugin.receiveNotification;
        } else if (this.platform.is('ios')) {
          data = event;
        }
        this.events.publish('receiveNotification', data);
      }, false);
    }
  }

  showLoginPage(done) {
    let modal = Modal.create(LoginPage);
    modal.onDismiss((user) => {
      // 触发回调函数
      done && done(user);
    });
    this.nav.present(modal);
  }

  registerOpenNotification() {
    this.events.subscribe('openNotification', (data) => {
      const {extras} = data[0];
      let statusNames, statusName, modal;

      switch (extras.code) {
        case '100': // 拍卖师收到拍品审核请求
        case '106': // 拍卖师收到拍品审核请求
          statusNames = {'100':  'pending', '106':  'ended'};
          statusName = statusNames[extras.code];
          modal = Modal.create(AkProductsPage, {statusName: statusName, notifyProductId: extras.pid});
          this.nav.present(modal);
          break;
        case '101': // 卖家收到拍品审核通过
        case '102': // 卖家收到拍品审核不通过
        case '103': // 卖家收到拍品被上架
          statusNames = {'101':  'processing', '102':  'ended', '103': 'online'};
          statusName = statusNames[extras.code];
          modal = Modal.create(OwnerProductsPage, {statusName: statusName, notifyProductId: extras.pid});
          this.nav.present(modal);
          break;
      }
    });
  }
}

ionicBootstrap(App, [
  ...DIRECTIVES,
  ...PIPES,
  ...PROVIDERS,
], {
  tabbarPlacement: 'bottom',
  tabSubPages: true,
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthShortNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
});
