import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {LoopbackAPI} from '../loopback-api';

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
}

ProductService.PRODUCTS_URL = '/ak-products';
