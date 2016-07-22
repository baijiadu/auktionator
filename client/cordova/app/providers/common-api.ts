import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import {Config} from '../util/index';
import {Service} from './service';

export class CommonAPI extends Service {
  constructor(protected http: Http) {
    super();
  }

  get(url, params = null, query = null) {
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.get(CommonAPI.URL(url, params, query)), resolve, reject);
    });
  }

  post(url, body = {}, params = null) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.post(CommonAPI.URL(url, params), JSON.stringify(body), options), resolve, reject);
    });
  }

  handleRequest(observable, resolve, reject) {
    return observable
      .map(res => res.json())
      .do(res => this.handleSuccess(res))
      .subscribe(res => {
        if (!Config.isProd) this.handleSuccess(res);

        if (res['API_RESULT'] == 'success') {
          delete res['API_RESULT'];
          resolve(res);
        } else {
          reject(res);
        }
      }, res => {
        if (!Config.isProd) this.handleError(res);

        reject({API_RESULT: 'error', ERR_MSG: '服务器访问异常，请稍后再试', ERR_CODE: 500});
      });
  }

  handleSuccess(res) {
    console.group('访问Common API成功');
    console.log('返回数据：', res);
    console.groupEnd();
  }

  handleError(res) {
    console.group('访问Common API异常');
    console.error('URL：', res.url);
    console.error('错误信息：', res._body);
    console.groupEnd();
  }

  static URL(url, params = null, query = null) {
    if (params) {
      if (Array.isArray(params)) {
        // Is Array
        let counter = 0;
        url = url.replace(/{[A-Za-z]+}/g, k => {
          return params[counter++];
        });
      } else {
        // Is Map
        url = url.replace(/{[A-Za-z]+}/g, k => {
          return params[k.substring(1, k.length - 1)];
        });
      }
    }
    if (query) {
      let kvs = query.map((v, k) => {
        return k + '=' + encodeURIComponent(v);
      });
      url += '?' + kvs.join('&');
    }
    return Config.host + '/api/v1' + url;
  }
}
