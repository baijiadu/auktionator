import {NavController, Modal, Loading, NavParams, ViewController, Popover} from 'ionic-angular';
import {Component} from '@angular/core';
import _ from 'underscore';

import Mixins from '../../mixins';
import Config from '../../config';
import Async from '../../async';
import QiniuUtil from '../../qiniu-util';
import Util from '../../util';

import {GridImg} from '../../components/image/grid-img';
import {SelectAuktionatorPage} from './select-auktionator';

import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

@Component({
  templateUrl: 'build/pages/product/publish.html',
  directives: [GridImg],
})
export class ProductPublishPage {
  static get parameters() {
    return [[NavController], [UserService], [ProductService], [NavParams], [ViewController]];
  }

  constructor(nav, userService, productService, params, viewCtrl) {
    this.nav = nav;
    this.userService = userService;
    this.productService = productService;
    this.viewCtrl = viewCtrl;

    this.product = params.get('product') || {
        ownerId: this.user.id,
        status: 0,
        uploadImages: [],
      };

    this.selectedAuktionator = null;
    if (this.product.auktionator) {
      this.selectedAuktionator = this.product.auktionator; // format
      delete this.product.auktionator;
    }
    this.uploadImageLimit = Config.productPublishImageLimit;
  }

  get user() {
    return this.userService.currentUser;
  }

  get isEdit() {
    return !!this.product.id;
  }

  pickImage(e) {
    const remain = this.uploadImageLimit - this.product.uploadImages.length;
    let files = e.target.files;

    if (remain > 0 && files.length > 0) {
      let loading = Loading.create({
        content: '资源加载中...',
      });

      this.nav.present(loading).then(() => {
        let tasks = [];

        for (let i = 0; i < files.length; i++) {
          ((file) => {
            tasks.push((cb) => {
              loadImage(
                file,
                canvas => {
                  if (canvas.type === "error") {
                    cb(canvas);
                  } else {
                    let scaledCanvas = loadImage.scale(
                      canvas, {
                        maxWidth: 150,
                        maxHeight: 150,
                        minWidth: 150,
                        minHeight: 150,
                      }
                    );
                    cb(null, {
                      file: file,
                      thumb: scaledCanvas.toDataURL('image/jpeg'),
                    })
                  }
                }, {
                  crop: true,
                  aspectRatio: 1,
                  canvas: true,
                  crossOrigin: true,
                }
              );
            });
          })(files[i]);
        }

        let uploadImages = this.product.uploadImages;
        Async.serial(tasks, (err, results) => {
          loading.dismiss();
          if (err) return Mixins.toast('图片加载失败');
          uploadImages.push.apply(uploadImages, results);
        })
      });
    }
  }

  delUploadImage(index) {
    this.product.uploadImages.splice(index, 1);
  }

  selectAuktionator() {
    if (this.isEdit) return;

    let modal = Modal.create(SelectAuktionatorPage);
    modal.onDismiss(auktionator => {
      if (auktionator) {
        this.selectedAuktionator = auktionator;
      }
    });
    this.nav.present(modal);
  }

  onSubmit() {
    let {title, content, uploadImages, beginningPrice, increasePrice} = this.product;

    if (!title) return Mixins.toast('拍品描述不能为空');
    if (!content) return Mixins.toast('拍品描述不能为空');
    //if (content.length < 20 || content.length > 2000) return Mixins.toast('拍品描述格式不正确');
    if (uploadImages.length <= 0) return Mixins.toast('至少需要上传一张效果图');
    if (!this.selectedAuktionator) return Mixins.toast('请选择拍卖师');
    if (!beginningPrice) return Mixins.toast('请设置起拍价');
    if (!increasePrice) return Mixins.toast('请设置加价幅度');

    this.product.auktionatorId = this.selectedAuktionator.id;

    let loading = Loading.create({
      content: this.isEdit ? '提交中...' : '发布中...'
    });
    this.nav.present(loading).then(() => {
      let needUploadImages = _.filter(uploadImages, (item) => !!item.file);

      if (needUploadImages.length > 0) {
        this.userService.qiniuUptoken(needUploadImages.length).then((results) => {
          let counter = 0, tasks = [];

          uploadImages.forEach((image, index) => {
            if (!!image.file) {
              ((uptoken) => {
                tasks.push((cb) => {
                  const {key, token} = uptoken;

                  loadImage(image.file, canvas => {
                    if (canvas.type === "error") {
                      cb(canvas);
                    } else {
                      const width = canvas.width;
                      const height = canvas.height;

                      canvas.toBlob(blob => {
                        const size = blob.size;

                        QiniuUtil.uploadBlob(blob, key, token).then(blkRet => {
                          const normal = Config.qiniu.url + blkRet.key;

                          cb(null, {
                            index,
                            data: {
                              normal,
                              thumb: normal + '-' + Config.qiniu.styles['product.thumb'],
                              width,
                              height,
                              size,
                            }
                          });
                          return blkRet;
                        }, err => {
                        });
                      }, 'image/jpeg');
                    }
                  }, {
                    maxWidth: 960,
                    maxHeight: 960,
                    minWidth: 375,
                    minHeight: 375,
                    canvas: true,
                    crossOrigin: true,
                  });
                });
              })(results[counter++]);
            }
          });

          Async.serial(tasks, (err, results) => {
            if (err) return Mixins.toast('图片上传失败');
            results.forEach((result) => {
              this.product.uploadImages[result.index] = result.data;
            });
            this.upsertProduct(loading);
          });
        }, err => Mixins.toastAPIError(err));
      } else {
        this.upsertProduct(loading);
      }
    });
  }

  upsertProduct(loading) {
    this.product.thumb = this.product.uploadImages[0].thumb;

    let promise;
    if (this.isEdit) {
      promise = this.productService.update(this.product);
    } else {
      this.product.proNo = 'PMS-PM' + Util.generateRandomStr(14).toUpperCase();
      promise = this.productService.publish(this.product);
    }
    promise.then(product => {
      loading.dismiss().then(() => {
        this.dismiss(product);
      });
    }, err => {
      Mixins.toastAPIError(err);
      loading.dismiss();
    });
  }

  dismiss(product = null) {
    this.viewCtrl.dismiss(product);
  }

  showMaxPricePopover(ev) {
    let popover = Popover.create(MaxPricePopover);
    this.nav.present(popover, {
      ev: ev
    })
  }

  showMinPricePopover(ev) {
    let popover = Popover.create(MinPricePopover);
    this.nav.present(popover, {
      ev: ev
    })
  }

  showDeadTimePopover(ev) {
    let popover = Popover.create(DeadTimePopover);
    this.nav.present(popover, {
      ev: ev
    })
  }
}

@Component({
  template: '当出价达到或超过此价格立即成交（无一口价请设0元）',
})
class MaxPricePopover {
}

@Component({
  template: '当截拍时限制最低成交价不能低于此价格（无保底价请设0元）',
})
class MinPricePopover {
}

@Component({
  template: '设置一个截止日期，当拍卖师在该日期之前一直不上架，则取消拍卖该拍品（无有效期请设空）',
})
class DeadTimePopover {
}

