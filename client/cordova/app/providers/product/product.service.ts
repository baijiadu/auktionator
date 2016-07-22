import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Config} from '../../util/index';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class ProductService extends LoopbackAPI {

  static PRODUCTS_URL = '/ak-products';
  static PRODUCT_URL = '/ak-products/{id}';
  static OWNER_PRODUCTS_URL = '/ak-users/{id}/ownerProducts';
  static AK_PRODUCTS_URL = '/ak-users/{id}/auktionatorProducts';
  static PRODUCT_GAME_ADD_URL = '/ak-products/{id}/game/{gid}/add';
  static PRODUCT_GAME_SWITCH_URL = '/ak-products/{id}/game/{gid}/switch';

  constructor(public http: Http) {
    super(http);
  }

  publish(product) {
    return this.post(ProductService.PRODUCTS_URL, product);
  }

  update(product) {
    const {id} = product;
    return this.put(ProductService.PRODUCT_URL, product, {id});
  }

  editProduct(id) {
    let filter: any = {
      fields: {
        created: false,
        modified: false,
      },
      include: {
        relation: 'auktionator',
        scope: {
          fields: ['id', 'avatar', 'username', 'nickname', 'score'], // TODO 拍品选择时拍卖师的信息
        }
      }
    };
    return this.get(ProductService.PRODUCT_URL, {id}, filter);
  }

  detailProduct(id) {
    let filter: any = {
      include: [{
        relation: 'auktionator',
        scope: {
          fields: ['id', 'avatar', 'username', 'nickname'],
        }
      }, {
        relation: 'owner',
        scope: {
          fields: ['id', 'avatar', 'username', 'nickname'],
        }
      }],
    };
    return this.get(ProductService.PRODUCT_URL, {id}, filter);
  }

  ownerProducts(ownerId, statuses = null, page = 1) {
    let filter: any = {
      fields: {
        id: true,
        proNo: true,
        title: true,
        thumb: true,
        status: true,
        created: true,
        modified: true,
        ownerId: true,
        auktionatorId: true,
      },
      where: {},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['modified DESC'],
      include: {
        relation: 'auktionator',
        scope: {
          fields: ['username', 'nickname'],
        }
      }
    };

    if (statuses) {
      filter.where.status = {inq: statuses};
    }
    return this.get(ProductService.OWNER_PRODUCTS_URL, {id: ownerId}, filter);
  }

  akProducts(akId, statuses = null, page = 1) {
    let filter: any = {
      fields: {
        id: true,
        proNo: true,
        title: true,
        thumb: true,
        status: true,
        created: true,
        modified: true,
        ownerId: true,
        auktionatorId: true,
      },
      where: {},
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['modified DESC'],
      include: {
        relation: 'owner',
        scope: {
          fields: ['username', 'nickname'],
        }
      }
    };

    if (statuses) {
      filter.where.status = {inq: statuses};
    }
    return this.get(ProductService.AK_PRODUCTS_URL, {id: akId}, filter);
  }

  searchAkCheckedProducts(akId, selected, keyword = '', page = 1) {
    let filter: any = {
      fields: {
        id: true,
        content: true,
        thumb: true,
        status: true,
        created: true,
        ownerId: true,
        auktionatorId: true,
      },
      where: {
        status: {inq: [1, 2, 6]}, // 已审核
        id: {nin: selected}, // 排除已选择
      },
      limit: Config.pageSize,
      skip: (page - 1) * Config.pageSize,
      order: ['id ASC'],
      include: {
        relation: 'owner',
        scope: {
          fields: ['username', 'nickname'],
        }
      }
    };

    if (keyword) {
      filter.where = {
        status: {inq: [1]},
        //or: [{nickname: {like: keyword}}, {username: {like: keyword}}]
      }
    }
    return this.get(ProductService.AK_PRODUCTS_URL, {id: akId}, filter);
  }

  queryProductsImagesByIds(ids) {
    let filter: any = {
      fields: {
        id: true,
        thumb: true,
        uploadImages: true,
        ownerId: true,
      },
      where: {
        id: {inq: ids},
      },
      include: {
        relation: 'owner',
        scope: {
          fields: ['id', 'username', 'nickname'],
        }
      }
    };
    return this.get(ProductService.PRODUCTS_URL, null, filter);
  }

  updateAttribute(id, attributes = {}) {
    return this.put(ProductService.PRODUCT_URL, attributes, {id});
  }

  addIntoGame(id, gid) {
    return this.put(ProductService.PRODUCT_GAME_ADD_URL, {}, {id, gid});
  }

  switchGame(id, gid) {
    return this.put(ProductService.PRODUCT_GAME_ADD_URL, {}, {id, gid});
  }
}


