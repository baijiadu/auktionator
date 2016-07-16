import {NavController, Platform, Events, Loading} from 'ionic-angular';
import {Component} from '@angular/core';

import Config from '../../config';
import Mixins from '../../mixins';

@Component({
  selector: 'game-item',
  templateUrl: 'build/pages/home/game-item.html',
  inputs: ['item'],
})
export class GameItem {
  constructor() {}
}
