import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

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

    return this.get(ZoneService.ZONE_URL, null, filter)
      .then(zones => {
        this.zones = zones;
      });
  }
}

ZoneService.ZONE_URL = '/ak-zones';
