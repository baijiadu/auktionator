import {Page, NavController, ViewController, Modal} from 'ionic-angular';
import {Toast} from 'ionic-native';

import {UserService} from '../../providers/user/user.service';
import {LocalService} from '../../providers/storage/local.service';
import {ForgetPwdPage} from './forget-pwd';
import {VerifyTelPage} from './verify-tel';

@Page({
  templateUrl: 'build/pages/account/login.html',
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [ViewController], [UserService], [LocalService]];
  }

  constructor(nav, viewCtrl, userService, localService) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.userService = userService;
    this.localService = localService;

    this.actionType = 'login';
    this.loginData = {};
    this.registerData = {};

    this.verifyCodeProcessing = false;
    this.verifyCodeCounter = 60;
    this.verifyCodeInterval = null;
    this.weixinInstalled = false;
  }

  onPageDidEnter() {
    Wechat.isInstalled(installed => {
      this.weixinInstalled = !!installed;
    }, reason => {
      Toast.showLongBottom('微信未安装');
    })
  }

  forgetPwd() {
    let modal = Modal.create(ForgetPwdPage);
    modal.onDismiss(user => {
      // TODO
    });
    this.nav.present(modal);
  }

  showVerifyTelPage(done) {
    let modal = Modal.create(VerifyTelPage);
    modal.onDismiss(done);
    this.nav.present(modal);
  }

  dismiss(user = null) {
    this.viewCtrl.dismiss(user);
  }

  login() {
    const {account, pwd} = this.loginData;

    if (!(/^1[3|4|5|7|8]\d{9}$/.test(account) || /^\w{2,19}$/.test(account))) return Toast.showLongBottom('账户格式不正确');
    if (!/^[a-zA-Z]\w{5,17}$/.test(pwd)) return Toast.showLongBottom('密码格式不正确');

    this.userService.login(account, pwd).then(
      user => this.viewCtrl.dismiss(user),
      err => Toast.showLongBottom(err.message || '未知错误，请稍后重试'));
  }

  register() {
    const {name, tel, code, pwd} = this.registerData;
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return Toast.showLongBottom('手机号格式不正确');
    if (!/^\d{6}$/.test(code)) return Toast.showLongBottom('验证码格式不正确');
    if (!/^\w{2,19}$/.test(name)) return Toast.showLongBottom('用户名格式不正确');
    if (!/^[a-zA-Z]\w{5,17}$/.test(pwd)) return Toast.showLongBottom('密码格式不正确');

    this.userService.register(name, tel, pwd, code).then(
      user => this.viewCtrl.dismiss(user),
      err => Toast.showLongBottom(err.message || '未知错误，请稍后重试'));
  }

  getVerifyCode() {
    const {tel} = this.registerData;

    this.userService.generateVerifyCode(tel).then(
      () => {
        Toast.showLongBottom('验证码已发送至手机，30分钟内有效');
        this.startVerifyCodeInterval();
      },
      err => Toast.showLongBottom(err.message || '未知错误，请稍后重试'));
  }

  startVerifyCodeInterval() {
    if (this.verifyCodeInterval) {
      clearInterval(this.verifyCodeInterval);
      this.verifyCodeCounter = 60;
    }
    this.verifyCodeProcessing = true;
    this.verifyCodeInterval = setInterval(() => {
      if (this.verifyCodeCounter <= 1) {
        this.verifyCodeCounter = 60;
        this.verifyCodeProcessing = false;
      } else {
        this.verifyCodeCounter--;
      }
    }, 1000);
  }

  thirdPartyAuth(platform) {
    this.localService.getThirdParties().then(thirdParties => {
      if (thirdParties && !!thirdParties.find((tp) => tp.name === platform)) {
        this.thirdPartyHasAuthed(platform);
      } else {
        this.thirdPartyNotAuthed(platform);
      }
    })
  }

  thirdPartyHasAuthed(platform) {
    switch (platform) {
      case 'weixin':

        break;
      case 'qq':
        break;
      default:
        break;
    }
  }

  thirdPartyNotAuthed(platform) {
    this.showVerifyTelPage(tel => {
      if (tel) {
        switch (platform) {
          case 'weixin':
            Wechat.auth("snsapi_userinfo", res => {
              this.userService.weixinAuth(res.code, tel).then(
                user => this.viewCtrl.dismiss(user),
                err => Toast.showLongBottom(err.message || '未知错误，请稍后重试'));
            }, reason => {
              Toast.showLongBottom(reason);
            });
            break;
          case 'qq':
            break;
          default:
            break;
        }
      }
    });
  }
}
