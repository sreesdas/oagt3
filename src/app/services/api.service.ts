import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService, People } from './database.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  journal:any = [];

  constructor(
    private http: HttpClient,
    private database: DatabaseService,
    private spinner: SpinnerDialog,
    private nativeStorage: NativeStorage,
    private toastController: ToastController,
  ) { 
    
  }

  fetchJournal() {
    this.spinner.show();

    let lastUpdatedTime = '2000-01-01 00:00:00';

    this.nativeStorage.getItem('cachedTimedata')
      .then(
        data => {
          console.log( JSON.stringify(data) );
          if( data.lastUpdated ) {
            lastUpdatedTime = data.lastUpdated;
          }
          this.requestFetchJournal(lastUpdatedTime);
        },
        error => {
          console.log(JSON.stringify(error));
          this.requestFetchJournal(lastUpdatedTime);
        }
      );
  }

  updatePersonalDetails(person: People) {
    this.http.post( `https://oagtapp.xyz/apis/updatePersonalDetails.php`, person ).subscribe(res => {
      // this.database.readSinglePerson(person.cpf);
      this.spinner.hide();
      this.presentToastWithOptions();
    }, err => {
      console.log(JSON.stringify(err));
      this.spinner.hide();
    });
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      duration: 2500,
      message: 'Please close and reopen the app to reflect the change',
      position: 'bottom',
    });
    toast.present();
  }

  requestFetchJournal( lastUpdatedTime: string ) {
    this.http.get( `https://oagtapp.xyz/apis/getJournal.php?lastUpdated=${lastUpdatedTime}` ).subscribe(res => {
      this.journal = res['data'];
      this.updateDatabase();
      if(res['time']) this.saveUpdatedTime( res['time'] );
      this.spinner.hide();
    }, err => {
      console.log(JSON.stringify(err));
      this.spinner.hide();
    });
  }

  saveUpdatedTime( time: string) {
    this.nativeStorage.setItem('cachedTimedata', { lastUpdated: time })
      .then(
        () => {
          console.log('Stored time data!');
        },
        error => console.error('Error storing time data', error)
      );
  }

  updateDatabase() {
    this.journal.forEach( data => {
      switch (data.operation) {
        case 'insert':
          this.database.addPerson([
            data.cpf,
            data.name,
            data.designation,
            data.avatar,
            data.mobile,
            data.office_ext,
            data.office_alt,
            data.residence_ext,
            data.residence_alt,
            data.address,
            data.email,
            data.carrier
          ])
          break;
        
        case 'update':
          this.database.updatePerson([
            data.name,
            data.designation,
            data.avatar,
            data.mobile,
            data.office_ext,
            data.office_alt,
            data.residence_ext,
            data.residence_alt,
            data.address,
            data.email,
            data.carrier,
            data.cpf,
          ])
          break;

        case 'delete':
          this.database.deletePerson(data.cpf);
          break;
          
        default: break;
      }
    });
  }

}
