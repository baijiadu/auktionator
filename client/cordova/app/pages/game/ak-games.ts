import {NavController, NavParams, Modal} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {GamePublishPage, GameDetailPage} from '../../pages/index';
import {UserService, GameService} from '../../providers/index';
import {StatusesList} from '../statuses-list';

@Component({
  templateUrl: 'build/pages/game/ak-games.html',
})
export class AkGamesPage extends StatusesList {

  constructor(private nav: NavController, private userService: UserService, private gameService:GameService, private params:NavParams) {
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
  }

  get user() {
    return this.userService.currentUser;
  }

  delegateLoad(statuses, page, refresh) {
    return this.gameService.akGames(this.user.id, statuses, page);
  }

  showDetail(game) {
    const {status} = game;

    if (status === 0) { // 编辑中
      this.editGame(game);
    } else if (status === 1) { // 已发布
      this.nav.push(GameDetailPage, {game: game});
    }
  }

  editGame(game) {
    this.gameService.editingGame(game.id).then(g => {
      let modal = Modal.create(GamePublishPage, {game: g});
      modal.onDismiss(newGame => {
        if (newGame) {
          if (newGame.status === 0) {
            Mixins.toast('拍场保存成功');
          } else if (newGame.status === 1) {
            Mixins.toast('拍场发布成功');
          }
          this.statusList.splice(this.statusList.findIndex((g) => game.id === g.id), 1, newGame);
        }
      });
      this.nav.present(modal);
    }, (err) => Mixins.toast('获取拍场数据异常'));
  }
}
