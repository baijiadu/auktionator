import {NavController, Modal, Loading, NavParams, ViewController, Alert} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import Async from '../../async';
import QiniuUtil from '../../qiniu-util';
import Util from '../../util';

import {GridImg} from '../../components/image/grid-img';
import {UserService} from '../../providers/user/user.service';
import {GameService} from '../../providers/game/game.service';
import {ProductService} from '../../providers/product/product.service';

import {SelectProductPage} from './select-product';
import {ProductDetailPage} from '../product/product-detail';
import {AkGamesPage} from './ak-games';
import {SelectCoverPage} from './select-cover';

@Component({
  templateUrl: 'build/pages/game/publish.html',
  directives: [GridImg],
})
export class GamePublishPage {
  static get parameters() {
    return [[NavController], [UserService], [GameService], [NavParams], [ViewController]];
  }

  constructor(nav, userService, gameService, params, viewCtrl) {
    this.nav = nav;
    this.userService = userService;
    this.gameService = gameService;
    this.viewCtrl = viewCtrl;

    this.game = params.get('game') || {
        auktionatorId: this.user.id,
        _sections: [],
        begin: 18,
        end: 21,
        dateNo: this.nowDateNo,
        covers: {},
      };

    this.dateRange = {
      lower: this.game.begin,
      upper: this.game.end,
    };

    this.game.covers = this.game.covers || {}; // 封面详情
    this.covers = this.game.covers;
    this.uploadImageLimit = Config.productPublishImageLimit;
  }

  get nowDateNo() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();

    return [y, m < 10 ? '0' + m : m, d < 10 ? '0' + d : d].join('-');
  }

  get user() {
    return this.userService.currentUser;
  }

  get isEdit() {
    return !!this.game.id;
  }

  saveAsDraft() {
    const {_sections, title, content, dateNo, begin, end, cover} = this.game;
    const {lg, sm1, sm2} = this.covers;

    if (!title) return Mixins.toast('请设置拍场标题');
    if (!content) return Mixins.toast('请填写拍场说明');
    if (lg && (!sm1 || !sm2) || sm1 && (!lg || !sm2) || sm2 && (!lg || !sm1)) return Mixins.toast('请设置拍场封面');

    let loading = Loading.create({
      content: '保存中...'
    });

    this.game.status = 0;
    this.nav.present(loading).then(() => {
      if (!cover && lg && sm1 && sm2) {
        // 合成封面
        this.uploadCover().then((cover) => {
          this.game.cover = cover;
          this.upsertGame(loading);
        }, (err) => Mixins.toast('合成封面异常'));
      } else {
        this.upsertGame(loading);
      }
    });
  }

  onSubmit() {
    const {_sections, title, content, dateNo, begin, end, cover} = this.game;
    const {lg, sm1, sm2} = this.covers;

    if (!title) return Mixins.toast('请设置拍场标题');
    if (!content) return Mixins.toast('请填写拍场说明');
    if (!dateNo) return Mixins.toast('请设置拍场开始日期');
    if (!begin || !end) return Mixins.toast('请设置拍场起止时段');
    if (!_sections || _sections.length <= 0) return Mixins.toast('请选择至少一件拍品');
    if (!lg || !sm1 || !sm2) return Mixins.toast('请设置拍场封面');

    let confirm = Alert.create({
      title: '拍场发布确认',
      message: '拍场发布后将不能再修改相关信息，是否继续操作？',
      buttons: [
        {
          text: '再看看',
          handler: () => {}
        },
        {
          text: '确认发布',
          handler: () => {
            let loading = Loading.create({
              content: '发布中...'
            });

            this.game.status = 1;
            this.nav.present(loading).then(() => {
              if (!cover) {
                // 合成封面
                this.uploadCover().then((cover) => {
                  this.game.cover = cover;
                  this.upsertGame(loading);
                }, (err) => Mixins.toast('合成封面异常'));
              } else {
                this.upsertGame(loading);
              }
            });
          }
        }
      ]
    });
    this.nav.present(confirm);
  }

  upsertGame(loading) {
    let promise;

    if (this.isEdit) {
      promise = this.gameService.update(this.game);
    } else {
      this.game.gameNo = 'PMS-PC' + Util.generateRandomStr(14).toUpperCase();
      promise = this.gameService.publish(this.game);
    }
    promise.then(game => {
      loading.dismiss().then(() => {
        this.dismiss(game);
      });
    }, err => {
      Mixins.toastAPIError(err);
      loading.dismiss();
    });
  }

  dismiss(game = null) {
    this.viewCtrl.dismiss(game);
  }

  dateRangeChanged(e) {
    this.game.begin = this.dateRange.lower;
    this.game.end = this.dateRange.upper;
  }

  selectProduct() {
    let modal = Modal.create(SelectProductPage, {
      selected: this.game._sections.map((item) => item.id),
    });
    modal.onDismiss(products => {
      if (products) {
        let sections = this.game._sections;
        sections.push.apply(sections, products.map((p) => {
          return {id: p.id, thumb: p.thumb};
        }));
      }
    });
    this.nav.present(modal);
  }

  delProduct(index) {
    this.game._sections.splice(index, 1);
  }

  showProductDetail(i) {
    var {id} = this.game._sections[i];

    this.nav.push(ProductDetailPage, {
      product: {id},
      readonly: true,
    });
  }

  selectCover(name) {
    let modal = Modal.create(SelectCoverPage, {
      ids: this.game._sections.map((section) => section.id),
    });
    modal.onDismiss(cover => {
      if (cover) {
        this.covers[name] = cover;

        // 一旦选择了封面，就需要重新合成封面
        this.game.cover = null;
      }
    });
    this.nav.present(modal);
  }

  generateCover() {
    return new Promise((resolve, reject) => {
      const {lg, sm1, sm2} = this.covers;
      let canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
      const {coverWidth, coverHeight, coverSpacing} = Config.game;
      canvas.width = coverWidth + coverSpacing;
      canvas.height = coverHeight;

      // img,sx,sy,swidth,sheight,x,y,width,height
      var tasks = [
        [lg + '-' + Config.qiniu.styles['game.cover.lg'], 0, 0],
        [sm1 + '-' + Config.qiniu.styles['game.cover.sm'], 324, 0],
        [sm2 + '-' + Config.qiniu.styles['game.cover.sm'], 324, 122],
      ].map((data) => {
        return (cb) => {
          loadImage(
            data[0],
            (img) => {
              if (img.type === "error") {
                cb('err');
              } else {
                data[0] = img;
                cb(null, data);
              }
            }, {
              crossOrigin: true,
            }
          );
        }
      });

      Async.serial(tasks, (err, results) => {
        if (err) return reject(err);

        results.forEach((data) => {
          ctx.drawImage.apply(ctx, data);
        });
        resolve(canvas);
      });
    });
  }

  uploadCover() {
    return new Promise((resolve, reject) => {
      this.generateCover().then(canvas => {
        this.userService.qiniuUptoken().then(results => {
          var {key, token} = results[0];
          canvas.toBlob(blob => {
            QiniuUtil.uploadBlob(blob, key, token).then(blkRet => {
              resolve(Config.qiniu.url + blkRet.key);
            }, err => {
              reject(err);
            });
          }, 'image/jpeg');
        }, err => reject(err));
      }, err => reject(err));
    })
  }
}
