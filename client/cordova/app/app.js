import {StatusBar} from 'ionic-native';
import {Component} from '@angular/core';
import {ionicBootstrap, Platform, Events} from 'ionic-angular';

import {TabsPage} from './pages/tabs/tabs';
import Config from './config';

import {UserService} from './providers/user/user.service'
import {Notification} from './providers/notification'
import {WhatsUpService} from './providers/whatsup/whatsup.service'
import {ZoneService} from './providers/zone/zone.service'
import {ProductService} from './providers/product/product.service'
import {GameService} from './providers/game/game.service'

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  prodMode: Config.isProd,
})
export class AuktionatorApp {
  static get parameters() {
    return [[Platform], [Events], [Notification]];
  }

  constructor(platform, events, notification) {
    this.rootPage = TabsPage;
    this.platform = platform;
    this.events = events;
    this.notification = notification;

    platform.ready().then(() => {
      StatusBar.styleDefault();

      this.handleJPush();
    });
  }

  handleJPush() {
    if (window.plugins && window.plugins.jPushPlugin) {
      let jPushPlugin = window.plugins.jPushPlugin;
      jPushPlugin.init();
      jPushPlugin.setDebugMode(true);

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
}

ionicBootstrap(AuktionatorApp, [WhatsUpService, ZoneService, UserService, ProductService, Notification, GameService], {
  tabbarPlacement: 'bottom',
  tabSubPages: true,
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthShortNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  //dayNames: [''],
  //dayShortNames: ['dom', 'seg', 'ter', ... ],
});
