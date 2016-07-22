import {ViewController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, QiniuUtil, Util, Config} from '../../util/index';
import {UserService} from '../../providers/index';

declare var loadImage;

@Component({
  templateUrl: 'build/components/image/uploading.html',
})
export class UploadingPage {
  files:any;
  amount:number;
  index:number = 1;
  suucessCount:number = 0;
  errCount:number = 0;
  results:Array<any> = [];

  constructor(private params:NavParams, private viewCtrl:ViewController, private userService:UserService) {
    //this.urls = params.get('urls');
    this.files = params.get('files');
    this.amount = this.files.length;

    this.startUpload();
  }

  startUpload() {
    this.userService.qiniuUptoken(this.files.length).then(results => {
      for (let i = 0; i < this.files.length; i++) {
        ((file, result) => {
          const {key, token} = result;

          loadImage(
            file,
            canvas => {
              const width = canvas.width;
              const height = canvas.height;

              canvas.toBlob(blob => {
                const size = blob.size;

                QiniuUtil.uploadBlob(blob, key, token).then((blkRet: any) => {
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
        })(this.files[i], results[i]);
      }
    }, err => Mixins.toastAPIError(err));
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
