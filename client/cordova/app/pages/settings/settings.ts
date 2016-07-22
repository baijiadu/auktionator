import {NavController, Events, Alert} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {

  constructor(private nav: NavController, private events: Events) {
  }

  logout() {
    this.nav.present(Alert.create({
      title: '注销确认',
      message: '您确定要注销当前用户吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: '确定',
          handler: () => {
            this.events.publish('user:logout');
          }
        }
      ]
    }));
  }
}
