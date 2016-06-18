import {ViewController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/components/image/img-preview.html',
})

export class ModalPreviewPage {
  static get parameters() {
    return [[NavParams], [ViewController]];
  }
  constructor(params, viewCtrl) {
    this.viewCtrl = viewCtrl;

    this.initial = params.get('initial');
    this.imgs = params.get('imgs');
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
