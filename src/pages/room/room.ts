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
    videoURL: string;
    time: number;
    playing: boolean;
  };
  roomDataInitiallyLoaded = false;

  sources;
  api:VgAPI;
  socket: SocketIOClient.Socket;
  clients: {}[];
  chats: Array<{message: string; client: { uid: string; name: string; imageURL: string, roomId: string }}>;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = firebase.auth().currentUser;
    this.roomId = navParams.get('roomId');
    
    const hostname = window.location.hostname === "localhost" ? window.location.hostname : "sync-server-v2.herokuapp.com";
    const protocol = window.location.hostname === "localhost" ? "http://" : "https://";
    const port = window.location.hostname === "localhost" ? 3000 : 80;
    this.socket = io(`${protocol}${hostname}${port === 80 ? '' : ':' + port}`);
    this.chats = [];
    this.amOwner = false;
    this.state = {
      videoURL: ``,
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
        this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {
          this.state.time = this.api.currentTime;
        });
      });

      this.socket.on('Sync', (data: { time: number, videoURL: string, playing: boolean }) =>  {
        if (this.amOwner) {
          if(!this.roomDataInitiallyLoaded) {
            this.sync(data);
            this.roomDataInitiallyLoaded = true;
          }
          this.socket.emit('StateUpdate', this.state);
        } else {
          this.sync(data);
        }
      });

    })

  }

  sync(data: { time: number, videoURL: string, playing: boolean } ) {
    console.log('syncing with new state');
    console.log(data);
    if(this.state.videoURL !== data.videoURL) {
      this.setCurrentVideo(data.videoURL);
      this.state.videoURL = data.videoURL;
    }
    if(this.state.playing !== data.playing) {
      if(data.playing) {
        //if(this.api.canPlay) {
          this.api.play();
          this.state.playing = true;
        //}
      } else {
        this.api.pause();
        this.state.playing = false;
      }
    }
    if(this.state.time > data.time + 1.5 || this.state.time < data.time - 1.5) {
      this.api.seekTime(data.time);
      this.state.time = data.time;
    }
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
    this.state.videoURL = $("#videoURL").val().toString();
    this.socket.emit('StateUpdate', this.state);
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
    if((!this.amOwner || $("#roomName").val().toString().trim() === "")) return;
    firebase.database().ref('/rooms/'+this.roomId).update({
      roomName: $("#roomName").val(),
      roomNameLower: $("#roomName").val().toString().toLowerCase()
    }).then(()=>{
      $("#roomName").val("");
    });
  }

  setRoomImage() {
    if(!this.amOwner || $("#roomImage").val().toString().trim() === "") return;
    if ($("#roomImage").val().toString().match(/\.(jpeg|jpg|gif|png)$/) === null) return;

    firebase.database().ref('/rooms/'+this.roomId).update({
      image: $("#roomImage").val()
    }).then(()=>{
      $("#roomImage").val("");
    });
    
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
    this.socket.close();
    this.navCtrl.setRoot(HomePage);
  }
}
