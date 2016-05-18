import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the FavoritePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/favorite/favorite.html',
})
export class FavoritePage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
