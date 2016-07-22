import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Modal, NavController} from 'ionic-angular';

import {ModalPreviewPage} from './img-preview';

@Component({
  selector: 'grid-img',
  templateUrl: 'build/components/image/grid-img.html',
})
export class GridImg {
  static SIZE: number = 4;

  @Input() imgs: Array<any> = [];
  @Input() editable: boolean = false;
  @Input() previewable: boolean = false;
  @Input() cols: number = GridImg.SIZE;

  @Output() onDeleted = new EventEmitter();
  @Output() onPreview = new EventEmitter();

  constructor(private nav: NavController) {

  }

  delImg(index) {
    this.onDeleted.emit(index);
  }

  previewImg(index) {
    if (!this.previewable) return this.onPreview.emit(index);

    let modal = Modal.create(ModalPreviewPage, {
      initial: index,
      imgs: this.imgs,
    });
    this.nav.present(modal);
  }
}
