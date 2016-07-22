import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Config, AKStorage} from '../../util/index';
import {CommonAPI} from '../common-api';

@Injectable()
export class HomeService extends CommonAPI {
  static HOME_URL = '/home';

  homeData: any;

  constructor(http: Http) {
    super(http);
    this.homeData = {};

    AKStorage.load(AKStorage.HOME_DATA).then((homeData) => this.homeData = homeData || {});
  }

  loadHomeData() {
    return this.get(HomeService.HOME_URL).then((homeData) => {
      this.homeData = homeData;
      AKStorage.save(AKStorage.HOME_DATA, homeData);
    });
  }
}
