import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {LoopbackAPI} from '../loopback-api';
import Config from '../../config';

@Injectable()
export class ProductService extends LoopbackAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
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
    let filter = {
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
    let filter = {
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

  ownerProducts(ownerId, statuses = null, sinceId = null) {
    let filter = {
      fields: {
        id: true,
        content: true,
        thumb: true,
        status: true,
        created: true,
        ownerId: true,
        auktionatorId: true,
      },
      where: {},
      limit: Config.pageSize,
      order: ['id DESC'],
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

    if (sinceId) {
      filter.where.id = {lt: sinceId};
    }
    return this.get(ProductService.OWNER_PRODUCTS_URL, {id: ownerId}, filter);
  }

  akProducts(akId, statuses = null, sinceId = null) {
    let filter = {
      fields: {
        id: true,
        content: true,
        thumb: true,
        status: true,
        created: true,
        ownerId: true,
        auktionatorId: true,
      },
      where: {},
      limit: Config.pageSize,
      order: ['id DESC'],
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

    if (sinceId) {
      filter.where.id = {lt: sinceId};
    }
    return this.get(ProductService.AK_PRODUCTS_URL, {id: akId}, filter);
  }

  updateAttribute(id, attributes = {}) {
    return this.put(ProductService.PRODUCT_URL, attributes, {id});
  }
}

ProductService.PRODUCTS_URL = '/ak-products';
ProductService.PRODUCT_URL = '/ak-products/{id}';
ProductService.OWNER_PRODUCTS_URL = '/ak-users/{id}/ownerProducts';
ProductService.AK_PRODUCTS_URL = '/ak-users/{id}/auktionatorProducts';
