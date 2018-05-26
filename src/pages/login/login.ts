import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import firebase from 'firebase';
import { HomePage } from '../home/home';

/**
 * Generated class for the loginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loggedin;
  error = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    const fb = new FormBuilder();
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    });
  }
  ionViewDidLoad() {
    this.loggedin = $(".loggedin").hide();
  }


  save() {
    const t = 500;
    const that = this;
    firebase.auth().signInWithEmailAndPassword(that.loginForm.controls['email'].value, that.loginForm.controls['password'].value).then(user => {
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
              $(this).find('h2').html("Welcome back, " + firebase.auth().currentUser.displayName);
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

    // after clicking login hide avatar and login
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
