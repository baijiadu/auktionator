import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';

import Mixins from '../../mixins';
import Config from '../../config';
import {UserService} from '../../providers/user/user.service';

@Component({
  templateUrl: 'build/pages/admin/manage-users.html',
})
export class ManageUsersPage {
  static get parameters() {
    return [[NavController], [UserService]];
  }

  constructor(nav, userService) {
    this.nav = nav;
    this.userService = userService;

    this.users = [];
    this.identityName = 'all';
    this.noMore = false;
  }

  ionViewLoaded() {
    this.loadUsers();
  }

  doInfinite(infiniteScroll) {
    const lastRecord = this.users[this.users.length - 1];

    if (lastRecord) {
      setTimeout(() => {
        this.loadUsers(lastRecord.id).then(
          users => {
            if (users.length >= Config.pageSize) {
              infiniteScroll.complete();
            }
          }, err => infiniteScroll.complete());
      }, 500);
    }
  }

  loadUsers(sinceId = null) {
    let identities = null;

    switch (this.identityName) {
      case 'buyer':
        identities= [0];
        break;
      case 'seller':
        identities= [1];
        break;
      case 'auktionator':
        identities= [2];
        break;
      case 'all':
      default:
        identities = null;
        break;
    }

    return this.userService.loadUsersByIdentities(identities, sinceId).then(users => {
      this.users.push.apply(this.users, users);
      if (users.length < Config.pageSize) {
        this.noMore = true;
      }
      return users;
    }, err => {
      Mixins.toastAPIError(err);
      return err;
    });
  }

  identitiesChanged(segment) {
    this.noMore = false;
    this.users = [];
    this.loadUsers();
  }

  identityChanged(slidingItem, user, identity) {
    this.userService.updateAttribute(user, {identity}).then(u => {
      slidingItem.close();
      user.identity = identity;

      if (this.identityName !== 'all') this.users.splice(this.users.indexOf(user), 1);
    }, err => Mixins.toastAPIError(err));
  }
}
