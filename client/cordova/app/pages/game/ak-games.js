import {NavController, NavParams} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {StatusesList} from '../statuses-list';
import Mixins from '../../mixins';

import {Str2DatePipe} from '../../pipes/str2date';
import {GameStatusPipe} from '../../pipes/game-status';

import {UserService} from '../../providers/user/user.service';
import {GameService} from '../../providers/game/game.service';

@Component({
  templateUrl: 'build/pages/game/ak-games.html',
  pipes: [Str2DatePipe, GameStatusPipe],
})
export class AkGamesPage extends StatusesList {
  static get parameters() {
    return [[NavController], [UserService], [GameService], [NavParams]];
  }

  constructor(nav, userService, gameService, params) {
    super([{
      name: 'all',
      statuses: null,
    }, {
      name: 'pending',
      statuses: [0],
    }, {
      name: 'online',
      statuses: [1, 2],
    }, {
      name: 'ended',
      statuses: [3, 10, 20],
    }], params.get('statusName'));

    this.nav = nav;
    this.userService = userService;
    this.gameService = gameService;

    this.user = this.userService.currentUser;
  }

  delegateLoad(statuses, page, refresh) {
    return this.gameService.akGames(this.user.id, statuses, page);
  }
}
