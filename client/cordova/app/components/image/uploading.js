import {ViewController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import QiniuUtil from '../../qiniu-util';
import Util from '../../util';
import Config from '../../config';

import {UserService} from '../../providers/user/user.service';

@Component({
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

    this.startUpload();
  }

  startUpload() {
    for (let i = 0; i < this.files.length; i++) {
      ((file) => {
        const key = Util.generateRandomStr() + '_' + new Date().getTime();
        this.userService.qiniuUptoken(key).then(data => {
          const uptoken = data.token;
          loadImage(
            file,
            canvas => {
              const width = canvas.width;
              const height = canvas.height;

              canvas.toBlob(blob => {
                const size = blob.size;

                QiniuUtil.uploadBlob(blob, key, uptoken).then(blkRet => {
                  const normal = Config.qiniu.url + blkRet.key;

                  this.results.push({
                    normal,
                    thumb: normal + '-' + Config.qiniu.styles['product.thumb'],
                    width,
                    height,
                    size,
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
              }, 'image/jpeg');
            }, {
              maxWidth: 540,
              maxHeight: 960,
              minWidth: 360,
              minHeight: 640,
              canvas: true,
              crossOrigin: true,
            }
          );
        }, err => Mixins.toastAPIError(err));
      })(this.files[i]);
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
