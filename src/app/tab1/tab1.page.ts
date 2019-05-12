import { Component } from '@angular/core';

import { DatabaseService, People } from '../services/database.service';
import { ToastController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private searchString: String;
  private init: People[] = [];
  people: People[] = [];

  constructor( 
    private database: DatabaseService,
    private api: ApiService,
    private toast: ToastController,
    private alertController: AlertController,
  ) {

    this.database.getDatabaseState().subscribe( ready => {
      if(ready){
        this.api.fetchJournal();
        this.database.getPeople().subscribe( people => {
          this.people = people;
          this.init = people;
          console.log(people);
        })
      }
    })
    
  }

  fetch() {
    // this.api.fetchJournal();
  }

  search(searchString) {
    this.people = this.init.filter((x) => x.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1  );
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Login to continue',
      backdropDismiss: false,
      animated: true,
      // subHeader: 'Login',
      inputs: [
        {
          name: 'cpf',
          type: 'text',
          placeholder: 'CPF Number'
        },
        {
          name: 'mobile',
          type: 'number',
          placeholder: 'Mobile No.'
        }
      ],
      buttons: [
        {
          text: 'Login',
          handler: (data) => {

              setTimeout(function(){
                console.log(data);
                alert.dismiss();
              },3000);

              return false;
          }
        }
      ]
    });

    await alert.present();
  }
}
