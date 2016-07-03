import Mixins from '../mixins';
import Config from '../config';

class SearchList {
  constructor(keyword) {
    this.keyword = keyword || '';
    this.list = [];
    this.noMore = false;
    this.page = 0;
  }

  ionViewLoaded() {
    this.loadList();
  }

  get infiniteEnabled() {
    return this.list.length >= Config.pageSize && !this.noMore;
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.loadList().then(list => infiniteScroll.complete(), err => infiniteScroll.complete());
    }, 500);
  }

  doRefresh(refresher) {
    this.loadList(true).then(list => refresher.complete(), err => refresher.complete());
  }

  inputChanged() {
    this.loadList(true);
  }

  cancelSearch() {
    this.keyword = '';
    this.loadList(true);
  }

  loadList(research = false) {
    return this.delegateLoad(this.keyword, research ? 1 : this.page + 1, research).then(list => {
      if (research) {
        this.list = [];
        this.noMore = false;
        this.page = 0;
      }

      this.page++;
      this.list.push.apply(this.list, list);
      if (list.length < Config.pageSize) {
        this.noMore = true;
      }
      return list;
    }, err => {
      Mixins.toastAPIError(err)
      return err;
    });
  }

  delegateLoad(keyword, page, research = false) {
    // 需要子类来重写
  }
}

export {SearchList};
