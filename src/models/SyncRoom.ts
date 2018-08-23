import firebase from 'firebase';
import { ConstStrs } from '../utils/Utils';
import { resolveDefinition } from '../../node_modules/@angular/core/src/view/util';
import { Observable, Subscriber } from 'rxjs';

/**
 * Model/controller for room synching logic
 */
export class SyncRoom {
    private roomId: string;

    constructor(roomId: string,
        validationListener: (obs: Observable<boolean>) => any) {
        this.roomId = roomId;
        validationListener(this.roomIsValid);
    }

    roomIsValid = new Observable<boolean>((obs) => {
        this.validateId().then((val) => {
            // true if room is not invalidated
            obs.next(val !== undefined);
        });
    })

    get id(): Promise<string> {
        return this.validateId()
    }

    private validateId(): Promise<string> {
        // check if roomId snapshot does not return null from db
        return new Promise<string>((resolve, reject) => {
            firebase.database().ref(ConstStrs.ROOMS + this.roomId)
                .on('value', (snap)=>{
                    if(snap !== null) resolve(this.roomId);
                    else resolve(undefined);
                });
        });
    }
}