import {Page, NavController, ViewController} from 'ionic-angular';

import Mixins from '../../mixins';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';

@Page({
  templateUrl: 'build/pages/product/select-auktionator.html'
})
export class SelectAuktionatorPage {
  static get parameters() {
    return [[ViewController], [UserService]];
  }

  constructor(viewCtrl, userService) {
    this.viewCtrl = viewCtrl;
    this.userService = userService;

    this.keyword = '';
    this.auktionators = [];
    this.page = 1;

    this.userService.queryAuktionators().then(
      auktionators => this.auktionators = auktionators,
      err => Mixins.toastAPIError(err))
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.userService.queryAuktionators(this.keyword, this.page + 1).then(
        auktionators => {
          this.auktionators.push.apply(this.auktionators, auktionators);

          if (auktionators.length < Config.pageSize) {
            infiniteScroll.enable(false);
          } else {
            infiniteScroll.complete();
            this.page++;
          }
        },
        err => {
          Mixins.toastAPIError(err);
          infiniteScroll.complete();
        });
    }, 500);
  }

  queryAuktionators(e) {
    this.page = 1;
    this.userService.queryAuktionators(this.keyword).then(
      auktionators => this.auktionators = auktionators,
      err => Mixins.toastAPIError(err))
  }

  cancelSearch() {
    this.page = 1;
    this.keyword = '';
    this.userService.queryAuktionators().then(
      auktionators => this.auktionators = auktionators,
      err => Mixins.toastAPIError(err))
  }

  select(auktionator) {
    this.viewCtrl.dismiss(auktionator);
  }
}
