import {NavController, ViewController, Modal, Events, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins, Config} from '../../util/index';
import {GamePublishPage} from '../../pages/index';
import {UserService, GameService} from '../../providers/index';
import {SearchList} from '../search-list';

@Component({
  templateUrl: 'build/pages/product/select-game.html',
})
export class SelectGamePage extends SearchList {
  currentGameId: any;

  constructor(private nav: NavController,private viewCtrl:ViewController, private userService:UserService, private gameService:GameService, private events:Events, private params:NavParams) {
    super();
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
