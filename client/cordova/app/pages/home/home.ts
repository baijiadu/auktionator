import {NavController, Platform, Events, Loading} from 'ionic-angular';
import {Component} from '@angular/core';

import {Config, Mixins} from '../../util/index';
import {UserService, HomeService} from '../../providers/index';
import {GameLivePage, SearchGamePage, GameItem} from '../../pages/index';
import {Page} from '../page';

@Component({
  templateUrl: 'build/pages/home/home.html',
  //directives: [GameItem],
})
export class HomePage extends Page {
  carouselsOptions: any;

  constructor(nav: NavController, private events: Events, userService: UserService, private homeService: HomeService) {
    super(nav, userService);
    this.carouselsOptions = Config.carouselsOptions;
  }

  get homeData() {
    return this.homeService.homeData;
  }

  get carousels() {
    return this.homeData.carousels || [];
  }

  get icons() {
    return this.homeData.icons || [];
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

  handleCarouselsClick(carousel) {
    console.log(carousel);
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
        if (user) this.nav.push(GameLivePage, {game: game});
      });
    } else {
      this.nav.push(GameLivePage, {game: game});
    }
  }

  showMoreGames() {
    this.nav.push(SearchGamePage);
  }
}
