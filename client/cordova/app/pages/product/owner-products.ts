import {NavController, NavParams, Modal, Alert} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {Notification, UserService, ProductService} from '../../providers/index';
import {ProductPublishPage, ProductDetailPage} from '../../pages/index';
import {StatusesList} from '../statuses-list';

@Component({
  templateUrl: 'build/pages/product/owner-products.html',
})
export class OwnerProductsPage extends StatusesList {
  //@ViewChild('statusesSlide') statusesSlide: any;

  constructor(private nav:NavController, private userService:UserService, private productService:ProductService, private params:NavParams, private notification:Notification) {
    super([{
      name: 'all',
      statuses: null,
    }, {
      name: 'processing',
      statuses: [0, 1, 2, 6],
    }, {
      name: 'online',
      statuses: [3, 4],
    }, {
      name: 'ended',
      statuses: [5, 10, 11, 12, 14],
    }], params.get('statusName'));
  }

  get user() {
    return this.userService.currentUser;
  }

  get processingProductCount() {
    return this.notification.ownerProcessingProductCount;
  }

  get onlineProductCount() {
    return this.notification.ownerOnlineProductCount;
  }

  get endedProductCount() {
    return this.notification.ownerEndedProductCount;
  }

  delegateLoad(statuses, page, refresh) {
    return this.productService.ownerProducts(this.user.id, statuses, page);
  }

  editProduct(slidingItem, product) {
    slidingItem.close();

    this.productService.editProduct(product.id).then((p) => {
      let modal = Modal.create(ProductPublishPage, {product: p});
      modal.onDismiss(newProduct => {
        if (newProduct) {
          product = newProduct;
        }
      });
      this.nav.present(modal);
    }, err => Mixins.toastAPIError(err));
  }

  cancelItem(slidingItem, product) {
    this.nav.present(Alert.create({
      title: '拍品取消确认',
      message: '取消拍品可能会影响到您的信誉度，确定要取消吗？',
      buttons: [
        {
          text: '点错了',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: '确定',
          handler: () => {
            this.updateStatus(slidingItem, product, 14);
          }
        }
      ]
    }));
  }

  updateStatus(slidingItem, product, status) {
    slidingItem.close();
    this.productService.updateAttribute(product.id, {status}).then((p: any) => {
      product.status = p.status;

      if (this.statusName !== 'all') this.statusList.splice(this.statusList.indexOf(product), 1);
      Mixins.toast('处理成功');
    }, err => Mixins.toastAPIError(err));
  }

  showDetail(product) {
    this.nav.push(ProductDetailPage, {product});
  }

  statusChanged() {
    super.statusChanged();

    switch (this.statusName) {
      case 'processing':
        this.notification.reset('ownerProcessingProductCount');
        break;
      case 'online':
        this.notification.reset('ownerOnlineProductCount');
        break;
      case 'ended':
        this.notification.reset('ownerEndedProductCount');
        break;
    }
  }
}
