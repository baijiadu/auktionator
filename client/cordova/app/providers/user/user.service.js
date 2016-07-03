import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Events} from 'ionic-angular';

import Config from '../../config';
import AKStorage from '../../ak-storage';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class UserService extends LoopbackAPI {
  static get parameters() {
    return [[Http], [Events]]
  }

  get currentUser() {
    return this.__currentUser;
  }

  set currentUser(user) {
    this.__currentUser = user;
    AKStorage.saveCurrentUser(user);
  }

  constructor(http, events) {
    super(http);
    this.events = events;
    this.__currentUser = null;
  }

  // 微信授权登陆
  weixinAuth(code, tel = null) {
    return this.post(UserService.WEIXIN_AUTH, {code, tel})
      .then(data => this.afterLogin(data));
  }

  // 微信已授权，快速登陆
  weixinLogin(openid) {
    return this.post(UserService.WEIXIN_LOGIN, {openid})
      .then(data => this.afterLogin(data));
  }

  // 账户，密码登陆
  login(account, password) {
    return this.post(UserService.USER_LOGIN, {account, password})
      .then(data => this.afterLogin(data));
  }

  // 自动登录
  autoLogin(tel) {
    return this.post(UserService.USER_LOGIN_AUTO, {tel})
      .then(data => this.afterLogin(data));
  }

  // 注册
  register(username, tel, password, code) {
    return this.post(UserService.USER_REGISTER, {username, tel, password, code})
      .then(data => this.afterLogin(data));
  }

  afterLogin(data) {
    this.currentUser = data.user;
    this.events.publish('user:logged', data.user);
    return data.user;
  }

  // 入驻成为商家
  beSeller() {
    return this.updateCurrentUserAttributes({identity: 1});
  }

  generateVerifyCode(tel) {
    return this.post(UserService.GENERATE_VERIFY_CODE, {tel});
  }

  matchVerifyCode(tel, code) {
    return this.post(UserService.MATCH_VERIFY_CODE, {tel, code});
  }

  qiniuUptoken(count = 1) {
    return this.post(UserService.QINIU_UPTOKEN, {count}).then(data => data.tokens, err => err);
  }

  searchAuktionators(keyword = '', page = 1) {
    let filter = {
      fields: {
        id: true,
        avatar: true,
        score: true,
        nickname: true,
        username: true,
      },
      where: {identity: 2},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['score DESC', 'id ASC'],
    };

    if (keyword) {
      filter.where = {
        identity: 2,
        or: [{nickname: {like: keyword}}, {username: {like: keyword}}]
      }
    }
    return this.get(UserService.USERS, null, filter);
  }

  updateCurrentUserAttributes(attributes = {}) {
    const {id} = this.currentUser;
    return this.put(UserService.USER, attributes, {id})
      .then(user => {
        let currentUser = this.currentUser;

        Object.keys(attributes).forEach(name => currentUser[name] = user[name]);
        this.currentUser = currentUser;
        return user;
      });
  }

  updateAttribute(id, attributes = {}) {
    return this.put(UserService.USER, attributes, {id});
  }

  loadUsersByIdentities(identities = null, page = 1) {
    let filter = {
      fields: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
        tel: true,
        identity: true,
        created: true,
        modified: true,
      },
      where: {},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['modified ASC']
    };

    if (identities) {
      filter.where.identity = {inq: identities};
    }
    return this.get(UserService.USERS, null, filter);
  }
}

UserService
  .WEIXIN_AUTH = '/ak-users/weixin/auth';
UserService
  .WEIXIN_LOGIN = '/ak-users/weixin/login';
UserService
  .USER_LOGIN = '/ak-users/login';
UserService
  .USER_REGISTER = '/ak-users/register';
UserService
  .USER_LOGIN_AUTO = '/ak-users/login/auto';
UserService
  .GENERATE_VERIFY_CODE = '/ak-users/verify-code/g';
UserService
  .MATCH_VERIFY_CODE = '/ak-users/verify-code/m';
UserService
  .USERS = '/ak-users';
UserService
  .USER = '/ak-users/{id}';
UserService
  .QINIU_UPTOKEN = '/ak-users/qiniu/uptoken';
