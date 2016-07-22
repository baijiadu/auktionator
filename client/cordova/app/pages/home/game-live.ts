import {NavController, NavParams, Alert, Modal, Loading} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {UserService, GameService} from '../../providers/index';
import {ProductDetailPage} from '../../pages/index';

@Component({
  templateUrl: 'build/pages/home/game-live.html',
})
export class GameLivePage {
  @ViewChild('mainContent') mainContent: any;

  game: any;
  tabName: string;
  currentProductId: number;

  constructor(private nav: NavController, private userService: UserService, private gameService: GameService, private params: NavParams) {
    this.game = params.get('game');
    this.tabName = 'akInfo';
    this.currentProductId = null; // 当前显示拍品的index
  }

  get user() {
    return this.userService.currentUser;
  }

  get currentProduct() {
    const {products} = this.game;
    let product = {};

    if (this.currentProductId && products) {
      product = products.find((p) => p.id === this.currentProductId);
    }
    return product;
  }

  get running() {
    return this.game.status === 2;
  }

  ionViewLoaded() {
    this.loadGame();
  }

  ionViewDidEnter() {
    // 连接服务器
    if (this.running) {
      let loading = Loading.create({
        content: '服务器连接中...',
      });

      //this.nav.present(loading).then(() => {
      //  this.loadHomeData().then(data => loading.dismiss(), err => loading.dismiss());
      //});
    }
  }

  loadGame() {
    return this.gameService.detailGame(this.game.id).then((game: any) => {
      this.game = game;
      if (!this.currentProductId) this.currentProductId = game._sections[0].id;
      return game;
    }, err => {
      Mixins.toastAPIError(err);
      return err;
    });
  }

  switchSection(section) {
    this.currentProductId = section.id;
  }

  back() {
    if (this.running) {
      this.nav.present(Alert.create({
        title: '离场确认',
        message: '您确定要离开拍场吗？',
        buttons: [
          {
            text: '再看看',
            handler: () => {}
          },
          {
            text: '离开',
            handler: () => {
              this.nav.pop();
            }
          }
        ]
      }));
    } else {
      this.nav.pop();
    }
  }

  showProductDetail() {
    this.nav.push(ProductDetailPage, {
      product: this.currentProduct,
      readonly: true,
    });
  }

  share() {

  }

  favorite() {

  }
}
