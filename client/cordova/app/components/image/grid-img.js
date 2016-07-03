import {Component, EventEmitter} from '@angular/core';
import {Modal, NavController, IONIC_DIRECTIVES} from 'ionic-angular';

import {ModalPreviewPage} from './img-preview';
import {List2GridPipe} from '../../pipes/list2grid';

@Component({
  selector: 'grid-img',
  templateUrl: 'build/components/image/grid-img.html',
  directives: [IONIC_DIRECTIVES],
  inputs: ['imgs', 'editable', 'previewable', 'cols'],
  outputs: ['onDeleted', 'onPreview'],
  pipes: [List2GridPipe],
})
export class GridImg {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;

    this.imgs = [];
    this.editable = false;
    this.previewable = false;
    this.cols = GridImg.SIZE;

    this.onDeleted = new EventEmitter();
    this.onPreview = new EventEmitter();
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

GridImg.SIZE = 4;
