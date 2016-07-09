import {NavController, ViewController, Modal, Events, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';

import {Str2DatePipe} from '../../pipes/str2date';
import {UserService} from '../../providers/user/user.service';
import {GameService} from '../../providers/game/game.service';
import {SearchList} from '../search-list';

import {GamePublishPage} from '../game/publish';

@Component({
  templateUrl: 'build/pages/product/select-game.html',
  pipes: [Str2DatePipe],
})
export class SelectGamePage extends SearchList {
  static get parameters() {
    return [[NavController], [ViewController], [UserService], [GameService], [Events], [NavParams]];
  }

  constructor(nav, viewCtrl, userService, gameService, events, params) {
    super();

    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.userService = userService;
    this.gameService = gameService;
    this.events = events;

    this.currentGameId = params.get('currentGameId')
  }

  get user() {
    return this.userService.currentUser;
  }

  dismiss(game = null) {
    this.viewCtrl.dismiss(game);
  }

  delegateLoad(keyword, page, research = false) {
    return this.gameService.searchAkEditingGames(this.user.id, keyword, page);
  }

  showGamePublishPage() {
    let modal = Modal.create(GamePublishPage);
    modal.onDismiss(game => {
      if (game) {
        this.events.publish('game:created', game);
        this.dismiss(game);
      }
    });
    this.nav.present(modal);
  }
}
