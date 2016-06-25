import Mixins from '../mixins';
import Config from '../config';

class StatusesList {
  constructor(statusesData, statusName) {
    this.statusesData = statusesData; // [{name: 'all', statuses: [0, 1], noMore: false, list: []}]
    this.statusName = statusName || statusesData[0].name; // all

    this.statusesData.forEach((data) => {
      data.noMore = false;
      data.list = [];
    });

    //this.statusesSlideOptions = {
    //  initialSlide: this.statusIndex,
    //};
  }

  ionViewLoaded() {
    this.loadList();
  }

  get infiniteEnabled() {
    return this.statusList.length >= Config.pageSize && !this.statusNoMore;
  }

  get statusData() {
    return this.statusesData.find(data => this.statusName === data.name);
  }

  get statusIndex() {
    return this.statusesData.findIndex(data => this.statusName === data.name);
  }

  get statusList() {
    return this.statusData.list;
  }

  set statusList(list) {
    this.statusData.list = list;
  }

  get statusNoMore() {
    return this.statusData.noMore;
  }

  set statusNoMore(noMore) {
    this.statusData.noMore = noMore;
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.loadList().then(list => infiniteScroll.complete(), err => infiniteScroll.complete());
    }, 500);
  }

  doRefresh(refresher) {
    this.loadList(true).then(list => refresher.complete(), err => refresher.complete());
  }

  loadList(refresh = false) {
    const statusData = this.statusData;
    const statuses = statusData ? statusData.statuses : null;

    return this.delegateLoad(statuses, refresh).then(list => {
      if (refresh) {
        this.statusList = [];
        this.statusNoMore = false;
      }

      this.statusList.push.apply(this.statusList, list);
      if (list.length < Config.pageSize) {
        this.statusNoMore = true;
      }
      return list;
    }, err => {
      Mixins.toastAPIError(err)
      return err;
    });
  }

  statusChanged() {
    if (this.statusList.length <= 0) this.loadList();

    //const slideIndex = this.statusesSlide.getActiveIndex();
    //
    //if (this.statusIndex !== slideIndex) {
    //  this.statusesSlide.slideTo(this.statusIndex);
    //} else {
    //  if (this.statusList.length <= 0) this.loadList();
    //}
  }

  //onStatusesSlideChanged() {
  //  const slideIndex = this.statusesSlide.getActiveIndex();
  //  this.statusName = this.statusesData[slideIndex].name;
  //  this.statusChanged();
  //}

  delegateLoad(statuses, refresh) {
    // 需要子类来重写
  }
}

export {StatusesList};
