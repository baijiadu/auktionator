import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import {StatusesList} from '../statuses-list';
import {UserService} from '../../providers/user/user.service';

@Component({
  templateUrl: 'build/pages/admin/manage-users.html',
})
export class ManageUsersPage extends StatusesList {
  static get parameters() {
    return [[NavController], [UserService]];
  }

  constructor(nav, userService) {
    super([{
      name: 'all',
      statuses: null,
    }, {
      name: 'buyer',
      statuses: [0],
    }, {
      name: 'seller',
      statuses: [1],
    }, {
      name: 'auktionator',
      statuses: [2],
    }], null);

    this.nav = nav;
    this.userService = userService;
  }

  get user() {
    return this.userService.currentUser;
  }

  delegateLoad(statuses, refresh) {
    const lastOne = this.statusList[this.statusList.length - 1];
    return this.userService.loadUsersByIdentities(statuses, !refresh && lastOne ? lastOne.id : null);
  }

  identityChanged(slidingItem, user, identity) {
    this.userService.updateAttribute(user.id, {identity}).then(u => {
      slidingItem.close();
      user.identity = identity;

      if (this.statusName !== 'all') this.statusList.splice(this.statusList.indexOf(user), 1);
    }, err => {
      Mixins.toastAPIError(err);
      slidingItem.close();
    });
  }
}
