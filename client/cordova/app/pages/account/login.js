import {Page, NavController, ViewController, Modal, Loading} from 'ionic-angular';

import Mixins from '../../mixins';
import {UserService} from '../../providers/user/user.service';
import AKStorage from '../../ak-storage';
import {ForgetPwdPage} from './forget-pwd';
import {VerifyTelPage} from './verify-tel';

@Page({
  templateUrl: 'build/pages/account/login.html',
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [ViewController], [UserService]];
  }

  constructor(nav, viewCtrl, userService) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.userService = userService;

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
      //Mixins.toast('微信未安装');
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

    if (!(/^1[3|4|5|7|8]\d{9}$/.test(account) || /^\w{2,19}$/.test(account))) return Mixins.toast('账户格式不正确');
    if (!/^[a-zA-Z]\w{5,17}$/.test(pwd)) return Mixins.toast('密码格式不正确');

    this.userService.login(account, pwd).then(
      user => this.viewCtrl.dismiss(user),
      err => Mixins.toastAPIError(err));
  }

  register() {
    const {name, tel, code, pwd} = this.registerData;
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return Mixins.toast('手机号格式不正确');
    if (!/^\d{6}$/.test(code)) return Mixins.toast('验证码格式不正确');
    if (!/^\w{2,19}$/.test(name)) return Mixins.toast('用户名格式不正确');
    if (!/^[a-zA-Z]\w{5,17}$/.test(pwd)) return Mixins.toast('密码格式不正确');

    this.userService.register(name, tel, pwd, code).then(
      user => this.viewCtrl.dismiss(user),
      err => Mixins.toastAPIError(err));
  }

  getVerifyCode() {
    const {tel} = this.registerData;

    this.userService.generateVerifyCode(tel).then(
      () => {
        Mixins.toast('验证码已发送至手机，30分钟内有效');
        this.startVerifyCodeInterval();
      },
      err => Mixins.toastAPIError(err));
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
    AKStorage.getThirdParties().then(thirdParties => {
      let thirdParty = thirdParties ? thirdParties.find(tp => tp.name === platform) : null;

      if (thirdParty) {
        this.thirdPartyHasAuthed(thirdParty);
      } else {
        this.thirdPartyNotAuthed(platform);
      }
    })
  }

  thirdPartyHasAuthed(thirdParty) {
    switch (thirdParty.name) {
      case 'weixin':
        this.userService.weixinLogin(thirdParty.openid).then(
          user => this.viewCtrl.dismiss(user),
          err => Mixins.toastAPIError(err));
        break;
      case 'qq':
        // TODO
        break;
      default:
        break;
    }
  }

  thirdPartyNotAuthed(platform) {
    this.showVerifyTelPage(tel => {
      if (tel) {
        let loading = Loading.create({
          content: "跳转中..."
        });
        this.nav.present(loading);

        switch (platform) {
          case 'weixin':
            Wechat.auth('snsapi_userinfo', '_' + Date.now(), res => {
              loading.dismiss();
              this.userService.weixinAuth(res.code, tel).then(
                user => {
                  this.viewCtrl.dismiss(user);
                  // 保存微信第三方登录相关信息
                  AKStorage.upsertThirdParty({
                    name: 'weixin',
                    openid: user.wx_openid,
                    unionid: user.wx_unionid,
                  });
                },
                err => Mixins.toastAPIError(err));
            }, reason => {
              Mixins.toast(reason);
            });
            break;
          case 'qq':
            // TODO
            break;
          default:
            break;
        }
      }
    });
  }
}
