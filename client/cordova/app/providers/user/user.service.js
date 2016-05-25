import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

import Config from '../../config';
import {LoopbackAPI} from '../loopback-api';

@Injectable()
export class UserService extends LoopbackAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
    super(http);
    this.currentUser = null;
  }
}
