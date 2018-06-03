import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import firebase from 'firebase';
import { HomePage } from '../home/home';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  loggedin;
  error = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    const fb = new FormBuilder();
    this.registerForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(2)])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    });
  }
  ionViewDidLoad() {
    this.loggedin = $(".loggedin").hide();
  }
  save() {
    const t = 500;
    const that = this;
    firebase.auth().createUserWithEmailAndPassword(that.registerForm.controls['email'].value, that.registerForm.controls['password'].value).then(user => {
      firebase.auth().currentUser.updateProfile({displayName: this.registerForm.controls['username'].value, photoURL: ''}).then(() => {
        firebase.auth().currentUser.sendEmailVerification();
        /**
         * Allocate a room for this user
         */
        firebase.database().ref('/rooms/'+firebase.auth().currentUser.uid).set({
          roomName: firebase.auth().currentUser.displayName + "'s theater",
          currentUrl: '',
          image: '',
          featured: false,
          ownerId: firebase.auth().currentUser.uid,
          ownerName: firebase.auth().currentUser.displayName,
          state: {
            currentTime: '',
            paused: true,
          },
          users: {
          }
        });

        $(".login_inner__check").css({
          'animation': '',
        });
        $(".login_inner__check--complete").find('ion-icon').animate({
          'opacity': '1'
        }, 500);
        setTimeout(()=>{
          // fade out the login board
          $(".login").fadeOut(500, function() {
            $(this).hide();
          });
          setTimeout(()=>{
            // on sucess reveal background and then 500ms later reveal welcome text
            $(".header").hide();
              
            $(".fixed-content, .scroll-content").css("margin-top", 0);
            
            this.loggedin.fadeIn(t, function() {
              $(this).show();
              $(this).find('h2').html("Welcome to Sync, " + firebase.auth().currentUser.displayName);
              setTimeout(()=>{
                $(".loggedin h2").animate({
                  'opacity': '1'
                }, t);
                setTimeout(() => {
                  that.navCtrl.setRoot(HomePage);
                }, 2300);
              }, 500);
            });
          },500);
        },1600);
      }); 
    }).catch(err => {
      this.error = true;
      setTimeout(()=>{
        $(".login_inner__check").css({
          'animation': '',
        });
        $(".login_inner__check--complete").find('ion-icon').animate({
          'opacity': '1'
        }, 500);
        setTimeout(()=> {
          alert(err.message);
          this.reset();
        }, 1100);
      },500);
      
    });

    // after clicking register hide avatar and login
    $(".login_inner, .login_inner__avatar").animate({
      'opacity': '0'
    }, t);

    setTimeout(function() {
      $(".login_inner__check").css({
        'opacity': '1',
        'animation': 'spinner 4s 0s linear',
        'transition': 'all ease 3s'
      });
    });
  }

  reset() {
    this.error = false;
    $(".login_inner, .login_inner__avatar").css('opacity', 1);
    $(".login_inner__check").css({
      'opacity': '0',
      'transition': ''
    });
    $(".login_inner__check--complete").find('ion-icon').css('opacity', 0);
  }

}
