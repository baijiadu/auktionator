import {Component, EventEmitter} from '@angular/core';
import {Modal, NavController, IONIC_DIRECTIVES} from 'ionic-angular';

import {ModalPreviewPage} from './img-preview';

@Component({
  selector: 'grid-img',
  templateUrl: 'build/components/image/grid-img.html',
  directives: [IONIC_DIRECTIVES],
  inputs: ['imgs', 'editable'],
  outputs: ['deleted'],
})
export class GridImg {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
    this.deleted = new EventEmitter();
  }

  delImg(index) {
    this.deleted.emit(index);
  }

  previewImg(index) {
    this.nav.present(Modal.create(ModalPreviewPage, {
      initial: index,
      imgs: this.imgs
    }));
  }
}
