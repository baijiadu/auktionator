import {NavController, Loading} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, Util} from '../../util/index';
import {UserService} from '../../providers/index';
import {Page} from '../page';

@Component({
  templateUrl: 'build/pages/my/be-auktionator.html',
})
export class BeAuktionatorPage {

  constructor(private nav:NavController) {}

  approve() {
    this.nav.push(BeAuktionatorInfoPage);
  }
}

@Component({
  templateUrl: 'build/pages/my/be-auktionator-info.html',
})
export class BeAuktionatorInfoPage extends Page {
  akInfo: any;

  constructor(nav: NavController, userService: UserService) {
    super(nav, userService);

    this.akInfo = this.user.akInfo || {tel: this.user.tel};
  }

  submit() {
    const {realName, idNumber, address, tel} = this.akInfo;

    if (!realName) return Mixins.toast('请填写真实姓名');
    if (!idNumber) return Mixins.toast('请填写身份证号');

    const result = Util.isIdNumber(idNumber);
    if (result != 'yes') return Mixins.toast(result);
    if (!address) return Mixins.toast('请填写联系地址');
    if (!tel) return Mixins.toast('请填写联系方式');

    this.showLoading('提交中...').then(() => {
      if (this.user.akInfo) {
        // 编辑，保存信息
        this.userService.updateAttribute(this.user.id, {akInfo: this.akInfo}).then((user: any) => {
          this.user.akInfo = user.akInfo;
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
        this.userService.updateAttribute(this.user.id, {akInfo: this.akInfo}).then((user: any) => {
          this.user.akInfo = user.akInfo;
          this.user = this.user;

          // 发送申请
          this.userService.sendApply({type: 'ak', applicantId: this.user.id}).then((apply: any) => {
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
  templateUrl: 'build/pages/my/be-auktionator-apply.html',
})
export class BeAuktionatorApplyPage extends Page {
  applyInfo: any;

  constructor(nav: NavController, userService: UserService) {
    super(nav, userService);

    this.applyInfo = {};
  }

  ionViewLoaded() {
    this.showLoading('加载中...').then(() => {
      this.userService.getAkApplyByUserId(this.user.id).then((apply) => {
        this.dismissLoading();
        this.applyInfo = apply;
      }, err => {
        this.dismissLoading();
        Mixins.toastAPIError(err);
      })
    });
  }

  edit() {
    this.nav.push(BeAuktionatorInfoPage);
  }
}
