import {Component, Input} from '@angular/core';
import {NavController, Platform, Events, Loading} from 'ionic-angular';

import {Config, Mixins} from '../../util/index';

@Component({
  selector: 'game-item',
  templateUrl: 'build/pages/home/game-item.html',
})
export class GameItem {
  @Input() item: any;
  constructor() {}
}
