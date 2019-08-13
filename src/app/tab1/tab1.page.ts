import { Component } from '@angular/core';

import { DatabaseService, People } from '../services/database.service';
import { ToastController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  searchString: String;
  people: People[] = [];

  constructor( 
    private database: DatabaseService,
    private api: ApiService,
    private toast: ToastController,
    private alertController: AlertController,
    private callNumber: CallNumber,
  ) {

    this.database.getDatabaseState().subscribe( ready => {
      if(ready){
        this.api.fetchJournal();
        this.database.getPeople().subscribe( people => {
          this.people = people;
        })
      }
    })
    
  }

  search(searchString) {
    // this.people = this.init.filter((x) => x.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1  );
    
    if( !searchString ) {
      this.database.readFavourites();
    } else {
      this.database.searchPeople(searchString);
    }
    
  }

  call( _number:string ) {

    this.callNumber.callNumber( _number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
