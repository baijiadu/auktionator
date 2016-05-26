import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import 'rxjs/add/operator/map';

import Config from '../config';

export class LoopbackAPI {
  constructor(http) {
    this.http = http;
  }

  get(url, params = null, filter = null) {
    return new Promise((resolve, reject) => {
      this.http.get(LoopbackAPI.URL(url, params, filter))
        .map(res => res.json())
        //.catch((err) => {
        //  console.error(err);
        //  reject(err);
        //})
        .subscribe(data => {
          resolve(data);
        })
    });
  }

  post(url, body = {}) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http.post(LoopbackAPI.URL(url), JSON.stringify(body), options)
        .map(res => res.json())
        //.catch((err) => {
        //  console.error(err);
        //  reject(err);
        //})
        .subscribe(data => {
          resolve(data);
        })
    });
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
