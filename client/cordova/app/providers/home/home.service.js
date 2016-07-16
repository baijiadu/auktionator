import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import Config from '../../config';
import AKStorage from '../../ak-storage';

import {CommonAPI} from '../common-api';

@Injectable()
export class HomeService extends CommonAPI {
  static get parameters() {
    return [[Http]]
  }

  constructor(http) {
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

HomeService.HOME_URL = '/home';
