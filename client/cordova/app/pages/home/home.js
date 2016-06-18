import {NavController, Platform} from 'ionic-angular';
import {Component} from '@angular/core';

import {WhatsUpService} from '../../providers/whatsup/whatsup.service';
import {ZoneService} from '../../providers/zone/zone.service';
import Config from '../../config';

@Component({
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

  ionViewLoaded() {
    this.whatsUpService.loadTops();
    this.zoneService.load();
  }

  whatsupTapped(whatsup) {
    console.log(whatsup);
  }
}
