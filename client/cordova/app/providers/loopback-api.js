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
      this.handleRequest(this.http.get(LoopbackAPI.URL(url, params, filter)), resolve, reject);
    });
  }

  post(url, body = {}, params = null) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.post(LoopbackAPI.URL(url, params), JSON.stringify(body), options), resolve, reject);
    });
  }

  put(url, body = {}, params = null) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.put(LoopbackAPI.URL(url, params), JSON.stringify(body), options), resolve, reject);
    });
  }

  patch(url, body = {}, params = null) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.patch(LoopbackAPI.URL(url, params), JSON.stringify(body), options), resolve, reject);
    });
  }

  delete(url, params = null) {
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.delete(LoopbackAPI.URL(url, params)), resolve, reject);
    });
  }

  head(url, params = null) {
    return new Promise((resolve, reject) => {
      this.handleRequest(this.http.head(LoopbackAPI.URL(url, params)), resolve, reject);
    });
  }

  handleRequest(observable, resolve, reject) {
    return observable
      .map(res => res.json())
      .do(res => this.handleSuccess(res))
      .subscribe(data => {
        resolve(data);
      }, res => {
        this.handleError(res);
        if (res.type === 2) {
          // API访问成功错误
          reject(JSON.parse(res._body).error);
        } else if (res.type === 3) {
          // 服务访问异常
          reject({status: 500, message: '服务器访问异常'});
        } else {
          reject({status: 500, message: '未知错误'});
        }
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
    if (filter) {
      url += '?filter=' + encodeURIComponent(JSON.stringify(filter));
    }
    return Config.host + '/api' + url;
  }
}
