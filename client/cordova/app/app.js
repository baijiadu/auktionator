import {StatusBar} from 'ionic-native';
import {Component} from '@angular/core';
import {ionicBootstrap, Platform} from 'ionic-angular';

import {TabsPage} from './pages/tabs/tabs';
import Config from './config';

import {UserService} from './providers/user/user.service'
import {WhatsUpService} from './providers/whatsup/whatsup.service'
import {ZoneService} from './providers/zone/zone.service'
import {ProductService} from './providers/product/product.service'

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  prodMode: Config.isProd,
})
export class AuktionatorApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.rootPage = TabsPage;
    this.platform = platform;

    platform.ready().then(() => {
      StatusBar.styleDefault();

      if (window.plugins && window.plugins.jPushPlugin) {
        window.plugins.jPushPlugin.init();
      }
    });
  }
}

ionicBootstrap(AuktionatorApp, [WhatsUpService, ZoneService, UserService, ProductService], {
  tabbarPlacement: 'bottom',
  tabSubPages: true,
});
