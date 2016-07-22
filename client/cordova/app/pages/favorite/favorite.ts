import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/favorite/favorite.html',
})
export class FavoritePage {
  favoriteType: string;

  constructor(private nav: NavController) {
    this.favoriteType = 'ak';
  }
}
