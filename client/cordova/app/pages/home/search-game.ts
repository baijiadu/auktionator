import {NavController, Modal, Events} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, Config} from '../../util/index';
import {GameService, UserService} from '../../providers/index';
import {GameDetailPage} from '../../pages/index';
import {SearchList} from '../search-list';

@Component({
  templateUrl: 'build/pages/home/search-game.html',
})
export class SearchGamePage extends SearchList {
  static get parameters() {
    return [[NavController], [GameService], [Events], [UserService]];
  }

  constructor(private nav: NavController, private gameService: GameService, private events: Events, private userService: UserService) {
    super();
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
