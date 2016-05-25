import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {TabsPage} from './pages/tabs/tabs';
import Config from './config';

import {UserService} from './providers/user/user.service'
import {WhatsUpService} from './providers/whatsup/whatsup.service'
import {ZoneService} from './providers/zone/zone.service'

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  prodMode: Config.isProd,
  config: {
    tabbarPlacement: 'bottom',
    tabSubPages: true
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [WhatsUpService, ZoneService, UserService],
})
export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.rootPage = TabsPage;
    this.platform = platform;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
