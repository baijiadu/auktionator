import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

import Config from '../../config';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class WhatsUpService extends LoopbackAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    super(http);
    this.tops = null;
  }

  loadTops() {
    if (this.tops) {
      return Promise.resolve(this.tops);
    }

    const filter = {
      where: {enabled: true},
      limit: Config.whatsupLimit,
      order: 'id DESC'
    };

    return new Promise(resolve => {
      this.http.get(WhatsUpService.URL(WhatsUpService.WHATS_UP_URL, null, filter))
        .map(res => res.json())
        .subscribe(whatsups => {
          this.tops = whatsups;
          resolve(this.tops);
        });
    });
  }
}

WhatsUpService.WHATS_UP_URL = '/ak-whats-ups';
