import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePageModule } from '../pages/home/home.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { PrivacyPageModule } from '../pages/privacy/privacy.module';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { RoomPageModule } from '../pages/room/room.module';
@NgModule({
  declarations: [
    MyApp

  ],
  imports: [
    BrowserModule,
    HomePageModule,
    WelcomePageModule,
    PrivacyPageModule,
    LoginPageModule,
    RegisterPageModule,
    RoomPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
