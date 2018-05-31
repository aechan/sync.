import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import firebase from 'firebase';
import { WelcomePage } from '../welcome/welcome';
import { RoomPage } from '../room/room';
/**
 * 
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
  theaters;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  goToRoom() {
    this.navCtrl.setRoot(RoomPage, {
      roomId: firebase.auth().currentUser.uid
    });
  }

  setImage(index, img="") {
    let colors = ['#E3DFFF'];
    let style = {};
    if(img !== "") {
      style = {
        'background-image': 'url('+img+')',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-color': colors[index % colors.length]
      };
    } else {
      style = {
        'background-image': 'url(/assets/imgs/defaulttheater.svg)',
        'background-size': '60%',
        'background-repeat': 'no-repeat',
        'background-color': colors[index % colors.length]
      };
    }
    return style;
  }

  pushRoom(id) {
    this.navCtrl.setRoot(RoomPage, {
      roomId: id
    });
  }

  snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
  };

  logout() {
    firebase.auth().signOut();
    this.navCtrl.setRoot(WelcomePage);
  }

  doSearch(tags) {
    console.log(tags);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.title = "Your activity feed";
    firebase.database().ref('/rooms').on('value', (snap) => {
      let array = this.snapshotToArray(snap);
      let idx = array.findIndex(function (obj) { return obj.featured; });
      array.splice(0, 0, array.splice(idx, 1)[0]);
      this.theaters = array;
    });
  }
}
