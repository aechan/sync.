import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { HomePage } from '../home/home';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  roomId: string;
  hideBPB: boolean = false;
  chatLength: number = 0;
  user: firebase.User;
  settingsShown: boolean = false;
  roomName: string = '';
  amOwner: boolean = false;
  dragMenuState: boolean = false; // false for up true for down
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = firebase.auth().currentUser;
    this.roomId = navParams.get('roomId');
    firebase.database().ref('/rooms/'+this.roomId).on('value', (snap)=>{
      const room = snap.val();
      this.roomName = room.roomName;
    });
    this.amOwner = (firebase.auth().currentUser.uid === this.roomId);
  }

  ionViewDidLoad() {
  }

  toggleSettings() {
    this.settingsShown = !this.settingsShown;

    if(this.settingsShown) {
      $("#settingsBox").show();
      $("#chat").hide();
    } else {
      $("#settingsBox").hide();
      $("#chat").show();
    }
  }

  dragMenu(event) {
    if(event.additionalEvent === "pandown" && !this.dragMenuState) {
      $("#playerMenu").slideDown(500);
      $("#dragBar").css({
        "transform": "translateY(90vh)"
      });
      this.dragMenuState = !this.dragMenuState;
    } else if (event.additionalEvent === "panup" && this.dragMenuState) {
      $("#playerMenu").slideUp();
      $("#dragBar").css({
        "transform": "none"
      });
      this.dragMenuState = !this.dragMenuState;

    }
  }

  inputChange(val) {
    this.chatLength = val.length;
  }

  clickMenu() {
    if(this.dragMenuState) {
      $("#playerMenu").slideUp(500);
      $("#dragBar").css({
        "transform": "none"
      });
      this.dragMenuState = !this.dragMenuState;

    } else {
      $("#playerMenu").slideDown(500);
      $("#dragBar").css({
        "transform": "translateY(90vh)"
      });
      this.dragMenuState = !this.dragMenuState;

    }
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  

}
