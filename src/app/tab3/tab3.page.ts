import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { DatabaseService, People } from '../services/database.service';
import { ApiService } from '../services/api.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  item: People;

  constructor(
    private nativeStorage: NativeStorage,
    private plt: Platform,
    private database: DatabaseService,
    private api: ApiService,
    private spinner: SpinnerDialog
  ) {

    this.item = {
      cpf: '',
      name: '',
      designation: '',
      avatar: '',
      mobile: '',
      office_ext: '',
      office_alt: '',
      residence_ext: '',
      residence_alt: '',
      address: '',
      email: '',
      carrier: ''
    };

    this.plt.ready().then(()=>{
      this.nativeStorage.getItem('cachedCredentials')
      .then(
        data => {
          if( data.cpf ) {
            this.database.getDatabaseState().subscribe( ready => {
              if(ready){
                this.database.getPerson().subscribe((person) => {
                  this.item = person;
                  console.log(JSON.stringify(this.item));
                });
                this.database.readSinglePerson(data.cpf);
              }
            })
          }
        },
        error => {
          console.log(JSON.stringify(error))
          alert('Error login in!');
        }
      );
    })
  }

  update() {
    this.spinner.show();
    this.api.updatePersonalDetails(this.item);
  }
}
