import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';

import Config from '../config';

export class LoopbackAPI {
  constructor(http) {
    this.http = http;
  }

  static URL(url, params = null, filter = null) {
    if (params) {
      if (Array.isArray(params)) {
        // Is Array
        let counter = 0;
        url.replace(/{[A-Za-z]+}/g, k => {
          return params[counter++];
        });
      } else {
        // Is Map
        url.replace(/{[A-Za-z]+}/g, k => {
          return params[k.substring(1, key.length - 1)];
        });
      }
    }
    if (filter) {
      url += '?filter=' + JSON.stringify(filter);
    }
    return Config.host + '/api' + url;
  }
}
