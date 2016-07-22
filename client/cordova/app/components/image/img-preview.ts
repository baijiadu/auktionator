import {ViewController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/components/image/img-preview.html',
})
export class ModalPreviewPage {
  initial:number;
  imgs:Array<any>;

  constructor(private params:NavParams, private viewCtrl:ViewController) {
    this.initial = params.get('initial');
    this.imgs = params.get('imgs');
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
