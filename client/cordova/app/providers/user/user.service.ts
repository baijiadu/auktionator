import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Events} from 'ionic-angular';

import {Config, AKStorage} from '../../util/index';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class UserService extends LoopbackAPI {

  static WEIXIN_AUTH = '/ak-users/weixin/auth';
  static WEIXIN_LOGIN = '/ak-users/weixin/login';
  static USER_LOGIN = '/ak-users/login';
  static USER_REGISTER = '/ak-users/register';
  static USER_LOGIN_AUTO = '/ak-users/login/auto';
  static GENERATE_VERIFY_CODE = '/ak-users/verify-code/g';
  static MATCH_VERIFY_CODE = '/ak-users/verify-code/m';
  static USERS = '/ak-users';
  static USER = '/ak-users/{id}';
  static QINIU_UPTOKEN = '/ak-users/qiniu/uptoken';
  static APPLIES_URL = '/ak-applies';
  static APPLY_URL = '/ak-applies/{id}';

  __currentUser:any;

  constructor(public http:Http, public events:Events) {
    super(http);
    this.__currentUser = null;
  }

  get currentUser() {
    return this.__currentUser;
  }

  set currentUser(user) {
    this.__currentUser = this.clone(user);
    AKStorage.save(AKStorage.CURRENT_USER, this.__currentUser);
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
    return this.post(UserService.QINIU_UPTOKEN, {count}).then((data:any) => data.tokens, err => err);
  }

  searchAuktionators(keyword = '', page = 1) {
    let filter:any = {
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
    let filter: any = {
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

  // 发送申请
  sendApply(data) {
    return this.post(UserService.APPLIES_URL, data);
  }

  getSellerApplyByUserId(applicantId, include = false) {
    let filter:any = {
      where: {
        type: 'seller',
        applicantId,
      }
    };

    if (include) {
      filter.include = {
        relation: 'applicant',
        scope: {
          fields: ['id', 'sellerInfo', 'avatar'],
        }
      };
    }
    return this.get(UserService.APPLIES_URL + '/findOne', null, filter);
  }

  getAkApplyByUserId(applicantId, include = false) {
    let filter:any = {
      where: {
        type: 'ak',
        applicantId,
      }
    };

    if (include) {
      filter.include = {
        relation: 'applicant',
        scope: {
          fields: ['id', 'akInfo', 'avatar'],
        }
      };
    }
    return this.get(UserService.APPLIES_URL + '/findOne', null, filter);
  }
}
