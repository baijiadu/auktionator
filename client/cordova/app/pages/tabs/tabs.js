import {Page} from 'ionic-angular';
import {HomePage} from '../home/home';
import {FavoritePage} from '../favorite/favorite';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  constructor() {
    this.tab1Root = HomePage;
    this.tab2Root = FavoritePage;
    this.tab3Root = DiscoveryPage;
    this.tab4Root = MyPage;
  }
}
