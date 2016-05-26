import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import Config from '../../config';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class UserService extends LoopbackAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    super(http);
    this.currentUser = null;
  }

  weixinAuth(code) {
    return this.post(UserService.WEIXIN_AUTH, {code})
      .then(data => {
        this.currentUser = data.user;
      });
  }
  weixinLogin(openid) {
    return this.post(UserService.WEIXIN_LOGIN, {openid})
      .then(data => {
        this.currentUser = data.user;
      });
  }
  login(account, password) {
    return this.post(UserService.USER_LOGIN, {account, password})
      .then(data => {
        this.currentUser = data.user;
      });
  }
  register(username, tel, password) {
    return this.post(UserService.USER_REGISTER, {username, tel, password})
      .then(data => {
        this.currentUser = data.user;
      });
  }
}

UserService.WEIXIN_AUTH = '/ak-users/weixin/auth';
UserService.WEIXIN_LOGIN = '/ak-users/weixin/login';
UserService.USER_LOGIN = '/ak-users/login';
UserService.USER_REGISTER = '/ak-users/register';
