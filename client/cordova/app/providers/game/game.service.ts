import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Config} from '../../util/index';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class GameService extends LoopbackAPI {

  static GAMES_URL = '/ak-games';
  static GAME_URL = '/ak-games/{id}';
  static AK_GAMES_URL = '/ak-users/{id}/auktionatorGames';
  static HOME_GAMES_URL = '/ak-games/home';

  constructor(public http:Http) {
    super(http);
  }

  publish(game) {
    return this.post(GameService.GAMES_URL, game);
  }

  update(game) {
    const {id} = game;
    return this.put(GameService.GAMES_URL, game, {id});
  }

  detailGame(id) {
    let filter: any = {
      include: [{
        relation: 'auktionator',
        scope: {
          fields: ['id', 'avatar', 'username', 'nickname'],
        }
      }, 'products'],
    };
    return this.get(GameService.GAME_URL, {id}, filter);
  }

  editingGame(id) {
    return this.get(GameService.GAME_URL, {id});
  }

  akGames(akId, statuses = null, page = 1) {
    let filter: any = {
      fields: {
        id: true,
        gameNo: true,
        title: true,
        cover: true,
        dateNo: true,
        begin: true,
        end: true,
        status: true,
        created: true,
        modified: true,
      },
      where: {},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['modified DESC'],
    };

    if (statuses) {
      filter.where.status = {inq: statuses};
    }
    return this.get(GameService.AK_GAMES_URL, {id: akId}, filter);
  }

  // 搜索所有未发布（便加重）
  searchAkEditingGames(akId, keyword = '', page = 1) {
    let filter: any = {
      fields: {
        id: true,
        gameNo: true,
        title: true,
        cover: true,
        dateNo: true,
        begin: true,
        end: true,
        created: true,
        modified: true,
      },
      where: {status: 0},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['modified DESC'],
    };

    if (keyword) {
      filter.where.title = {like: keyword};
    }
    return this.get(GameService.AK_GAMES_URL, {id: akId}, filter);
  }

  updateAttribute(id, attributes = {}) {
    return this.put(GameService.GAME_URL, attributes, {id});
  }

  homeGames() {
    return this.get(GameService.HOME_GAMES_URL);
  }

  searchAllGames(keyword = '', page = 1) {
    let fields = {
      covers: false,
      gameNo: false,
    }, include = {
      relation: 'auktionator',
      scope: {
        fields: ['id', 'username', 'nickname', 'avatar', 'score'],
      }
    };

    let filter: any = {
      fields: fields,
      where: {status: {inq: [1, 2]}},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['modified DESC'],
      include,
    };

    if (keyword) {
      filter.where.title = {like: keyword};
    }
    return this.get(GameService.GAMES_URL, null, filter);
  }
}
