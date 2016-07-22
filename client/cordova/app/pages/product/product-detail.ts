import {NavController, NavParams, Alert, Modal} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {SelectGamePage, GameDetailPage} from '../../pages/index';
import {UserService, ProductService} from '../../providers/index';

@Component({
  templateUrl: 'build/pages/product/product-detail.html',
})
export class ProductDetailPage {
  product: any;
  readonly: boolean;

  constructor(private nav:NavController, private userService:UserService, private productService:ProductService, private params:NavParams) {
    this.product = params.get('product');

    this.readonly = !!params.get('readonly');
  }

  get user() {
    return this.userService.currentUser;
  }

  ionViewLoaded() {
    this.loadProduct();
  }

  loadProduct() {
    return this.productService.detailProduct(this.product.id).then((product) => {
      this.product = product;
      return product;
    }, err => {
      Mixins.toastAPIError(err);
      return err;
    });
  }

  doRefresh(refresher) {
    this.loadProduct().then(product => refresher.complete(), err => refresher.complete());
  }

  cancelProduct() {
    this.nav.present(Alert.create({
      title: '拍品取消确认',
      message: '取消拍品可能会影响到您的信誉度，确定要取消吗？',
      buttons: [
        {
          text: '点错了',
          handler: () => {}
        },
        {
          text: '确定',
          handler: () => {
            this.updateStatus(14);
          }
        }
      ]
    }));
  }

  enterGame() {
    this.nav.push(GameDetailPage, {
      game: {id: this.product.gameId,}
    })
  }

  showOrderPage() {

  }

  agreeProduct() {
    this.updateStatus(1);
  }

  rejectProduct() {
    this.nav.present(Alert.create({
      title: '拍品拒绝确认',
      message: '您确定要拒绝该拍品吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {}
        },
        {
          text: '确定',
          handler: () => {
            this.updateStatus(10);
          }
        }
      ]
    }));
  }

  selectGame(isSwitch = false) {
    let product = this.product;
    let modal = Modal.create(SelectGamePage, {currentGameId: product.gameId});

    modal.onDismiss(game => {
      if (game && game.id !== product.gameId) {
        let promise = isSwitch
          ? this.productService.switchGame(product.id, game.id)
          : this.productService.addIntoGame(product.id, game.id);

        promise.then(p => {
          product.status = 2;
          product.gameId = game.id;
          Mixins.toast('处理成功');
        }, err => Mixins.toastAPIError(err));
      }
    });
    this.nav.present(modal);
  }

  updateStatus(status) {
    this.productService.updateAttribute(this.product.id, {status}).then((p: any) => {
      this.product.status = p.status;
      Mixins.toast('处理成功');
    }, err => Mixins.toastAPIError(err));
  }

  share() {

  }

  favorite() {

  }
}
