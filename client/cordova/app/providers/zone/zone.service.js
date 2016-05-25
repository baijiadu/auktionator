import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class ZoneService extends LoopbackAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    super(http);
    this.zones = null;
  }

  load() {
    if (this.zones) {
      return Promise.resolve(this.zones);
    }

    const filter = {
      where: {enabled: true},
      order: 'id ASC'
    };

    return new Promise(resolve => {
      this.http.get(ZoneService.URL(ZoneService.ZONE_URL, null, filter))
        .map(res => res.json())
        .subscribe(zones => {
          this.zones = zones;
          resolve(this.zones);
        });
    });
  }
}

ZoneService.ZONE_URL = '/ak-zones';
