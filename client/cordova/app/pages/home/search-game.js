import {NavController, Modal, Events} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';

import {Str2DatePipe} from '../../pipes/str2date';

import {GameService} from '../../providers/game/game.service';
import {UserService} from '../../providers/user/user.service';
import {SearchList} from '../search-list';

import {GameDetailPage} from '../game/game-detail';

@Component({
  templateUrl: 'build/pages/home/search-game.html',
  pipes: [Str2DatePipe],
})
export class SearchGamePage extends SearchList {
  static get parameters() {
    return [[NavController], [GameService], [Events], [UserService]];
  }

  constructor(nav, gameService, events, userService) {
    super();

    this.nav = nav;
    this.gameService = gameService;
    this.userService = userService;
    this.events = events;
  }

  delegateLoad(keyword, page, research = false) {
    return this.gameService.searchAllGames(keyword, page);
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
}
