import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import {VgAPI} from 'videogular2/core';
import io from 'socket.io-client';

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

  state: {
    url: string;
    time: number;
    playing: boolean;
  };

  sources;
  api:VgAPI;
  socket: SocketIOClient.Socket;
  clients: {}[];
  chats: Array<{message: string; client: { uid: string; name: string; imageURL: string, roomId: string }}>;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = firebase.auth().currentUser;
    this.roomId = navParams.get('roomId');
    
    const hostname = window.location.hostname === "localhost" ? window.location.hostname : "sync-server-v2.herokuapp.com";
    this.socket = io(`http://${hostname}:3000`);
    this.chats = [];
    this.amOwner = false;
    this.state = {
      url: ``,
      time: 0,
      playing: false
    };
  }

  async onPlayerReady(api:VgAPI) {
    this.api = api;

    /** setup event subscribers for video related events */
    // make the socket connect
    // setup evt handler for when we actually
    // join the room
    const userToken = await firebase.auth().currentUser.getIdTokenResult();
    this.socket.on('connect', () => {
      this.socket.emit('Authenticate', userToken.token);
      this.socket.on('Authenticated', () => {
        this.socket.emit("JoinRoom", this.roomId);
      });
      this.socket.on('JoinedRoom', (roomData) => {
        
      });
      this.socket.on('RoomInfo', (roomInfo) => {
        this.clients = roomInfo.clients;
        $("#onlineCount").text(`${this.clients.length} online`);
      });
      this.socket.on('Chat', (data) => {
        this.recievedChat(data);
      });

      this.socket.on('Owner', () => {
        this.amOwner = true;
        this.api.getDefaultMedia().subscriptions.play.subscribe(() => {
          this.state.playing = true;
        });
        this.api.getDefaultMedia().subscriptions.pause.subscribe(() => {
          this.state.playing = false;
        });
      });

      this.socket.on('Sync', (data: { time: number, url: string, playing: boolean }) =>  {
        if (this.amOwner) {
          this.socket.emit('StateUpdate', this.state);
        } else {
          this.sync(data);
        }
      });

    })

  }

  sync(data: { time: number, url: string, playing: boolean } ) {
    console.log('syncing');
    if(this.state.url !== data.url) {
      this.setCurrentVideo(data.url);
    }
    if(this.state.playing !== data.playing) {
      if(data.playing) {
        this.api.play();
      } else {
        this.api.pause();
      }
    }
    this.state = data;
  }

  setCurrentVideo(source: string) {
    console.log('Set URL to ' + source);
    this.sources = new Array<Object>();
    this.sources.push({
      src: source,
      type: "video/mp4"
    });
  }

  setVideoURL() {
    console.log('set video url');
    if(!this.amOwner || $("#videoURL").val().toString().trim() === "") return;
    this.socket.emit('SetVideoURL', $("#videoURL").val());
    this.setCurrentVideo($("#videoURL").val().toString());
  }

  ionViewDidLoad() {

    // add ourselves to the viewer list
    

    /** setup event subscribers for non video actions **/
    // subscribe to number of viewers changed
    
  }

  ionViewWillUnload() {

  }

  setRoomName() {
    if(!this.amOwner || $("#roomName").val().toString().trim() === "") return;

    
  }

  setRoomImage() {
    if(!this.amOwner || $("#roomImage").val().toString().trim() === "") return;

    
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

  chat(message) {
    this.socket.emit('Chat', message);
    $("#chatinput").val("");
    this.chatLength = 0;
  }

  recievedChat(data: {message: string; client: { uid: string; name: string; imageURL: string, roomId: string }}) {
    this.chats.push(data);
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
    this.socket.disconnect();
    this.navCtrl.setRoot(HomePage);
  }

  

}
