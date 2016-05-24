import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

import Config from '../../config';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class WhatsUp extends LoopbackAPI {
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
      this.http.get(WhatsUp.URL(WhatsUp.WHATS_UP_URL, null, filter))
        .map(res => res.json())
        .subscribe(whatsups => {
          this.tops = whatsups;
          resolve(this.tops);
        });
    });
  }
}

WhatsUp.WHATS_UP_URL = '/ak-whats-ups';
