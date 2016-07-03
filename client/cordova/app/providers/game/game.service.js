import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {LoopbackAPI} from '../loopback-api';
import Config from '../../config';

@Injectable()
export class GameService extends LoopbackAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
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
    let filter = {
      include: [{
        relation: 'auktionator',
        scope: {
          fields: ['id', 'avatar', 'username', 'nickname'],
        }
      }, {
        relation: 'products',
        scope: {
          fields: ['id', 'content', 'thumb', 'uploadImages', 'beginningPrice', 'increasePrice', 'guaranteePrice', 'ownerId', 'auktionatorId'],
        }
      }],
    };
    return this.get(GameService.GAME_URL, {id}, filter);
  }

  akGames(akId, statuses = null, page = 1) {
    let filter = {
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
        _sections: true,
        auktionatorId: true,
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

  updateAttribute(id, attributes = {}) {
    return this.put(GameService.PRODUCT_URL, attributes, {id});
  }
}

GameService.GAMES_URL = '/ak-games';
GameService.GAME_URL = '/ak-games/{id}';
GameService.AK_GAMES_URL = '/ak-users/{id}/auktionatorGames';
