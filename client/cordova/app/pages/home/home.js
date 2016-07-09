import {NavController, Platform, Events} from 'ionic-angular';
import {Component} from '@angular/core';

import Config from '../../config';
import Mixins from '../../mixins';

import {WhatsUpService} from '../../providers/whatsup/whatsup.service';
import {ZoneService} from '../../providers/zone/zone.service';
import {GameService} from '../../providers/game/game.service';
import {UserService} from '../../providers/user/user.service';

import {GameDetailPage} from '../game/game-detail';
import {SearchGamePage} from './search-game';

@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
  static get parameters() {
    return [[NavController], [WhatsUpService], [ZoneService], [GameService], [Events], [UserService]];
  }

  constructor(nav, whatsUpService, zoneService, gameService, events, userService) {
    this.nav = nav;
    this.whatsUpService = whatsUpService;
    this.zoneService = zoneService;
    this.gameService = gameService;
    this.gameService = gameService;
    this.events = events;
    this.userService = userService;

    this.whatsupOptions = Config.whatsupOptions;
    this.recommendGames = [];
    this.livingGames = [];
    this.notStartedGames = [];
  }

  ionViewLoaded() {
    this.whatsUpService.loadTops();
    this.zoneService.load();
    this.loadGames();
  }

  whatsupTapped(whatsup) {
    console.log(whatsup);
  }

  loadGames() {
    return this.gameService.homeGames().then(data => {
      this.recommendGames = data.recommendGames;
      this.livingGames = data.livingGames;
      this.notStartedGames = data.notStartedGames;

      return data;
    }, err => {
      Mixins.toastAPIError(err);
      return err;
    })
  }

  doRefresh(refresher) {
    this.loadGames().then(data => refresher.complete(), err => refresher.complete());
  }

  enterGameDetail(game) {
    if (!this.userService.currentUser) {
      // 未登录
      this.events.publish('user:login', (user) => {
        if (user) {
          this.nav.push(GameDetailPage, {game: game});
        }
      });
    } else {
      this.nav.push(GameDetailPage, {game: game});
    }
  }

  showMoreGamesPage() {
    this.nav.push(SearchGamePage);
  }
}
