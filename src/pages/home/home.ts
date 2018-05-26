import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import firebase from 'firebase';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  host: {
    '(document:click)': 'onClick($event)',
  },
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('search') search: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onClick(event) {
    console.log("Clicked: ");
    console.log(event.target);
    if (!this.search.nativeElement.contains(event.target)) {      
      this.closeSearch();
    }
   }

   logout() {
    firebase.auth().signOut();
    this.navCtrl.setRoot(WelcomePage);
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  closeSearch() {
    $(".cta").removeClass("active");

  }
  searchClick() {
    $(".cta:not(.sent)").addClass("active");
    $("input").focus();
  }

  doSearch() {
      $(".cta").removeClass("active");
  }
}
