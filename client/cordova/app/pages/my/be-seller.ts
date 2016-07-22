import {NavController, Loading} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, Util} from '../../util/index';
import {UserService} from '../../providers/index';
import {Page} from '../page';

@Component({
  templateUrl: 'build/pages/my/be-seller.html',
})
export class BeSellerPage {
  constructor(private nav:NavController ) {
    this.nav = nav;
  }

  approve() {
    this.nav.push(BeSellerInfoPage);
  }
}

@Component({
  templateUrl: 'build/pages/my/be-seller-info.html',
})
export class BeSellerInfoPage extends Page {
  sellerInfo: any;

  constructor(nav: NavController, userService: UserService) {
    super(nav, userService);

    this.sellerInfo = this.user.sellerInfo || {tel: this.user.tel};
  }

  submit() {
    const {realName, idNumber, address, tel} = this.sellerInfo;

    if (!realName) return Mixins.toast('请填写真实姓名');
    if (!idNumber) return Mixins.toast('请填写身份证号');

    const result = Util.isIdNumber(idNumber);
    if (result != 'yes') return Mixins.toast(result);
    if (!address) return Mixins.toast('请填写联系地址');
    if (!tel) return Mixins.toast('请填写联系方式');

    this.showLoading('提交中...').then(() => {
      if (this.user.sellerInfo) {
        // 编辑，保存信息
        this.userService.updateAttribute(this.user.id, {sellerInfo: this.sellerInfo}).then((user: any) => {
          this.user.sellerInfo = user.sellerInfo;
          this.user = this.user;

          this.dismissLoading().then(() => {
            this.nav.pop();
          });
        }, err => {
          this.dismissLoading();
          Mixins.toastAPIError(err);
        });
      } else {
        // 提交申请
        this.userService.updateAttribute(this.user.id, {sellerInfo: this.sellerInfo}).then((user: any) => {
          this.user.sellerInfo = user.sellerInfo;
          this.user = this.user;

          // 发送申请
          this.userService.sendApply({type: 'seller', applicantId: this.user.id}).then((apply: any) => {
            this.dismissLoading().then(() => {
              this.nav.popToRoot();
            });
            Mixins.toast('申请已提交，我们将尽快为您处理');
          }, err => {
            this.dismissLoading();
            Mixins.toastAPIError(err);
          });
        }, err => {
          this.dismissLoading();
          Mixins.toastAPIError(err);
        });
      }
    })
  }
}

@Component({
  templateUrl: 'build/pages/my/be-seller-apply.html',
})
export class BeSellerApplyPage extends Page {
  applyInfo: any;

  constructor(nav: NavController, userService: UserService) {
    super(nav, userService);

    this.applyInfo = {};
  }

  ionViewLoaded() {
    this.showLoading('加载中...').then(() => {
      this.userService.getSellerApplyByUserId(this.user.id).then((apply) => {
        this.dismissLoading();
        this.applyInfo = apply;
      }, err => {
        this.dismissLoading();
        Mixins.toastAPIError(err);
      })
    });
  }

  edit() {
    this.nav.push(BeSellerInfoPage);
  }
}
