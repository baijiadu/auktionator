import {NavController, Platform, Events, Loading} from 'ionic-angular';
import {Component} from '@angular/core';

import Config from '../../config';
import Mixins from '../../mixins';

import {UserService} from '../../providers/user/user.service';
import {HomeService} from '../../providers/home/home.service';

import {Page} from '../page';
import {GameDetailPage} from '../game/game-detail';
import {SearchGamePage} from './search-game';
import {GameItem} from './game-item';

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [GameItem],
})
export class HomePage extends Page {
  static get parameters() {
    return [[NavController], [Events], [UserService], [HomeService]];
  }

  constructor(nav, events, userService, homeService) {
    super();

    this.nav = nav;
    this.events = events;
    this.userService = userService;
    this.homeService = homeService;

    this.whatsupOptions = Config.whatsupOptions;
  }

  get homeData() {
    return this.homeService.homeData;
  }

  get whatsups() {
    return this.homeData.whatsups || [];
  }

  get zones() {
    return this.homeData.zones || [];
  }

  get recommendGames() {
    return this.homeData.recommendGames || [];
  }

  get livingGames() {
    return this.homeData.livingGames || [];
  }

  get notStartedGames() {
    return this.homeData.notStartedGames || [];
  }

  ionViewLoaded() {
    let loading = Loading.create({
      content: '数据加载中...',
    });

    this.nav.present(loading).then(() => {
      this.loadHomeData().then(data => loading.dismiss(), err => loading.dismiss());
    });
  }

  whatsupTapped(whatsup) {
    console.log(whatsup);
  }

  loadHomeData() {
    return this.homeService.loadHomeData().then(data => data, err => {
      Mixins.toastAPIError(err);
      return err;
    });
  }

  doRefresh(refresher) {
    this.loadHomeData().then(data => refresher.complete(), err => refresher.complete());
  }

  enterGameDetail(game) {
    if (!this.user) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (user) this.nav.push(GameDetailPage, {game: game});
      });
    } else {
      this.nav.push(GameDetailPage, {game: game});
    }
  }

  showMoreGamesPage() {
    this.nav.push(SearchGamePage);
  }
}
