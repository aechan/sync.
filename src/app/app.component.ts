import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { RoomPage } from '../pages/room/room';
@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = WelcomePage; // should be welcome page change later
  config = {
    apiKey: "AIzaSyBQnYkNcTjiWhTtB8E5MSO2LJ7z9qN9ckg",
    authDomain: "sync-9192c.firebaseapp.com",
    databaseURL: "https://sync-9192c.firebaseio.com",
    projectId: "sync-9192c",
    storageBucket: "sync-9192c.appspot.com",
    messagingSenderId: "69668555707"
  };
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
    firebase.initializeApp(this.config);
    firebase.auth().onAuthStateChanged(user => {
      if(user !== null) {
        this.rootPage = HomePage;
      }
    });
  }
}

