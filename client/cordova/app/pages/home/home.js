import {Page, NavController, Platform} from 'ionic-angular';

import {WhatsUpService} from '../../providers/whatsup/whatsup.service';
import {ZoneService} from '../../providers/zone/zone.service';
import Config from '../../config';

@Page({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
  static get parameters() {
    return [[NavController], [WhatsUpService], [ZoneService]];
  }

  constructor(nav, whatsUpService, zoneService) {
    this.nav = nav;
    this.whatsUpService = whatsUpService;
    this.zoneService = zoneService;

    this.whatsupOptions = Config.whatsupOptions;
  }

  onPageLoaded() {
    this.whatsUpService.loadTops();
    this.zoneService.load();
  }

  whatsupTapped(whatsup) {
    console.log(whatsup);
  }
}
