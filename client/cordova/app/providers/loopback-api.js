import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import Config from '../config';

export class LoopbackAPI {
  constructor(http) {
    this.http = http;
  }

  get(url, params = null, filter = null) {
    return new Promise((resolve, reject) => {
      this.http.get(LoopbackAPI.URL(url, params, filter))
        .map(res => res.json())
        .do(res => this.handleSuccess(res))
        .subscribe(data => {
          resolve(data);
        }, res => {
          this.handleError(res);
          reject(JSON.parse(res._body).error);
        })
    });
  }

  post(url, body = {}) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http.post(LoopbackAPI.URL(url), JSON.stringify(body), options)
        .map(res => res.json())
        .do(res => this.handleSuccess(res))
        .subscribe(data => {
          resolve(data);
        }, res => {
          this.handleError(res);
          reject(JSON.parse(res._body).error);
        })
    });
  }

  handleSuccess(res) {
    console.group('访问Loopback API成功');
    console.log('返回数据：', res);
    console.groupEnd();
  }

  handleError(res) {
    console.group('访问Loopback API异常');
    console.error('URL：', res.url);
    console.error('错误信息：', res._body);
    console.groupEnd();
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
