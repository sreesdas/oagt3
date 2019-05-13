import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from './database.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  journal:any = [];

  constructor(
    private http: HttpClient,
    private database: DatabaseService,
    private spinner: SpinnerDialog,
  ) { 
    
  }

  fetchJournal() {
    this.spinner.show();
    this.http.get('https://oagtapp.xyz/apis/getJournal.php').subscribe(res => {
      this.journal = res;
      this.updateDatabase();
      this.spinner.hide();
    });

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
