import {NavController, Modal, Loading, Events} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import {GridImg} from '../../components/image/grid-img';
import {UploadingPage} from '../../components/image/uploading';
import {SelectAuktionatorPage} from './select-auktionator';
import {OwnerProductsPage} from './owner-products';
import {UserService} from '../../providers/user/user.service';
import {ProductService} from '../../providers/product/product.service';

@Component({
  templateUrl: 'build/pages/product/publish.html',
  directives: [GridImg],
})
export class ProductPublishPage {
  static get parameters() {
    return [[NavController], [UserService], [ProductService], [Events]];
  }

  constructor(nav, userService, productService, events) {
    this.nav = nav;
    this.userService = userService;
    this.productService = productService;
    this.events = events;

    this.user = this.userService.currentUser;
    this.product = {
      uploadImages: [],
    };

    this.selectedAuktionator = null;
    this.isSubmiting = false;
    this.uploadImageLimit = Config.productPublishImageLimit;
  }

  pickImage(e) {
    const remain = this.uploadImageLimit - this.product.uploadImages.length;
    let files = e.target.files;
    if (remain > 0 && files.length > 0) {
      let modal = Modal.create(UploadingPage, {files: files});
      let uploadImages = this.product.uploadImages;
      modal.onDismiss((data) => {
        if (data) {
          if (data.errCount > 0) Mixins.toast(data.errCount + '张图片上传失败');
          uploadImages.push.apply(uploadImages, data.results);
        }
      });
      this.nav.present(modal);
    }
  }

  delUploadImage(index) {
    this.product.uploadImages.splice(index, 1);
  }

  selectAuktionator() {
    let modal = Modal.create(SelectAuktionatorPage);
    modal.onDismiss(auktionator => {
      if (auktionator) {
        this.selectedAuktionator = auktionator;
      }
    });
    this.nav.present(modal);
  }

  onSubmit() {
    const {content, uploadImages, beginningPrice, increasePrice} = this.product;

    if (!content) return Mixins.toast('拍品描述不能为空');
    if (content.length < 20 || content.length > 2000) return Mixins.toast('拍品描述格式不正确');
    if (uploadImages.length <= 0) return Mixins.toast('至少需要上传一张效果图');
    if (!this.selectedAuktionator) return Mixins.toast('请选择拍卖师');
    if (!beginningPrice) return Mixins.toast('请设置起拍价');
    if (!increasePrice) return Mixins.toast('请设置加价幅度');

    this.product.thumb = uploadImages[0].thumb;
    this.product.status = 0;
    this.product.ownerId = this.user.id;
    this.product.auktionatorId = this.selectedAuktionator.id;

    let loading = Loading.create({
      content: '发布中...'
    });
    this.nav.present(loading);

    setTimeout(() => {
      this.productService.publish(this.product).then(
        product => {
          loading.dismiss();
          this.events.publish('product:created', product);
          Mixins.toast('拍品发布成功，请耐心等待拍卖师的审核');
          this.nav.push(OwnerProductsPage, {statusName: 'processing'});
          setTimeout(() => this.nav.remove(this.nav.length() - 2), 600);
        }, err => {
          Mixins.toastAPIError(err);
          loading.dismiss();
        });
    }, 1000);
  }
}
