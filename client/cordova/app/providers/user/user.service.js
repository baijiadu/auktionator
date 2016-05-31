import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import Config from '../../config';
import AKStorage from '../../ak-storage';
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

  // 微信授权登陆
  weixinAuth(code, tel = null) {
    return this.post(UserService.WEIXIN_AUTH, {code, tel})
      .then(data => {
        this.currentUser = data.user;
        AKStorage.saveCurrentUser(this.currentUser);
        return data.user;
      });
  }

  // 微信已授权，快速登陆
  weixinLogin(openid) {
    return this.post(UserService.WEIXIN_LOGIN, {openid})
      .then(data => {
        this.currentUser = data.user;
        AKStorage.saveCurrentUser(this.currentUser);
        return data.user;
      });
  }

  // 账户，密码登陆
  login(account, password) {
    return this.post(UserService.USER_LOGIN, {account, password})
      .then(data => {
        this.currentUser = data.user;
        AKStorage.saveCurrentUser(this.currentUser);
        return data.user;
      });
  }

  // 自动登录
  autoLogin(tel) {
    return this.post(UserService.USER_LOGIN_AUTO, {tel})
      .then(data => {
        this.currentUser = data.user;
        AKStorage.saveCurrentUser(this.currentUser);
        return data.user;
      });
  }

  // 注册
  register(username, tel, password, code) {
    return this.post(UserService.USER_REGISTER, {username, tel, password, code})
      .then(data => {
        this.currentUser = data.user;
        AKStorage.saveCurrentUser(this.currentUser);
        return data.user;
      });
  }

  generateVerifyCode(tel) {
    return this.post(UserService.GENERATE_VERIFY_CODE, {tel});
  }

  matchVerifyCode(tel, code) {
    return this.post(UserService.MATCH_VERIFY_CODE, {tel, code});
  }
}

UserService.WEIXIN_AUTH = '/ak-users/weixin/auth';
UserService.WEIXIN_LOGIN = '/ak-users/weixin/login';
UserService.USER_LOGIN = '/ak-users/login';
UserService.USER_REGISTER = '/ak-users/register';
UserService.USER_LOGIN_AUTO = '/ak-users/login/auto';
UserService.GENERATE_VERIFY_CODE = '/ak-users/verify-code/g';
UserService.MATCH_VERIFY_CODE = '/ak-users/verify-code/m';
