import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import firebase from 'firebase';
import { WelcomePage } from '../welcome/welcome';
import { RoomPage } from '../room/room';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  TagsInput;
  title: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToRoom() {
    this.navCtrl.setRoot(RoomPage);
  }

  logout() {
    firebase.auth().signOut();
    this.navCtrl.setRoot(WelcomePage);
  }

  doSearch(tags) {
    console.log(tags);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.title = "Your activity feed"
  }
}
