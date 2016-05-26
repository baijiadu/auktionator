import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

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

    return this.get(WhatsUpService.WHATS_UP_URL, null, filter)
      .then(whatsups => {
        this.tops = whatsups;
      });
  }
}

WhatsUpService.WHATS_UP_URL = '/ak-whats-ups';
