import {Page, NavController, Platform} from 'ionic-angular';

import {WhatsUp} from '../../providers/whatsup/whatsup';
import {Zone} from '../../providers/zone/zone';
import Config from '../../config';

@Page({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
  static get parameters() {
    return [[NavController], [WhatsUp], [Zone]];
  };

  constructor(nav, whatsUp, zone) {
    this.nav = nav;
    this.whatsUp = whatsUp;
    this.whatsupOptions = Config.whatsupOptions;
    this.zone = zone;
  }

  onPageLoaded() {
    this.whatsUp.loadTops();
    this.zone.load();
  }

  whatsupTapped(whatsup) {
    console.log(whatsup);
  }
}
