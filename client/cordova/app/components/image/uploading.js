import {Page, ViewController, NavParams} from 'ionic-angular';

import Mixins from '../../mixins';
import QiniuUtil from '../../qiniu-util';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';

@Page({
  templateUrl: 'build/components/image/uploading.html',
})

export class UploadingPage {
  static get parameters() {
    return [[NavParams], [ViewController], [UserService]];
  }

  constructor(params, viewCtrl, userService) {
    this.viewCtrl = viewCtrl;
    this.userService = userService;

    //this.urls = params.get('urls');
    this.files = params.get('files');
    this.amount = this.files.length;
    this.index = 1;
    this.suucessCount = 0;
    this.errCount = 0;
    this.results = [];

    //this.userService.qiniuUptoken().then(uptoken => this.startUpload(uptoken), err => Mixins.toastAPIError(err));
    this.startUpload('');
  }

  startUpload(uptoken) {
    for (let i = 0; i < this.files.length; i++) {
      loadImage(
        this.files[i],
        canvas => {
          const width = canvas.width;
          const height = canvas.height;

          QiniuUtil.putb64(uptoken, canvas.toDataURL('image/jpeg', 1), blkRet => {
            const normal = Config.qiniu.url + blkRet.key;

            this.results.push({
              normal,
              thumb: normal + '-' + Config.qiniu.styles['product.thumb'],
              width: width,
              height: height,
            });
            this.suucessCount++;

            if (this.index >= this.amount) {
              this.done();
            } else {
              this.index++;
            }
            return blkRet;
          }, err => {
            this.errCount++;
            if (this.index >= this.amount) {
              this.done();
            } else {
              this.index++;
            }
            return err;
          });
        }, {
          maxWidth: 540,
          maxHeight: 960,
          minWidth: 360,
          minHeight: 640,
          canvas: true,
          crossOrigin: true,
        }
      );
    }
  }

  done() {
    this.viewCtrl.dismiss({
      suucessCount: this.suucessCount,
      errCount: this.errCount,
      results: this.results,
    });
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }
}
