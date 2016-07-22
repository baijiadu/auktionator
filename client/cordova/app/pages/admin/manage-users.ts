import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import {StatusesList} from '../statuses-list';
import {Mixins} from '../../util/index';
import {UserService} from '../../providers/index';

@Component({
  templateUrl: 'build/pages/admin/manage-users.html',
})
export class ManageUsersPage extends StatusesList {
  constructor(private nav: NavController, private userService: UserService) {
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
  }

  get user() {
    return this.userService.currentUser;
  }

  delegateLoad(statuses, page, refresh) {
    return this.userService.loadUsersByIdentities(statuses, page);
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
