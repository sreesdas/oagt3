import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from './database.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  resp:any = [];

  constructor(
    private http: HttpClient,
    private database: DatabaseService,
    private spinner: SpinnerDialog,
  ) { 
    
  }

  fetchJournal() {
    this.spinner.show();
    this.http.get('https://oagtapp.xyz/apis/index.php').subscribe(res => {
      this.resp = res['data'];
      console.log( JSON.stringify(res) );
      this.updateDatabase();
      this.spinner.hide();
    });

  }

  updateDatabase() {
    this.resp.forEach( data => {
      switch (data.operation) {
        case 'insert':
          this.database.addPerson([
            data.id,
            data.name,
            data.designation
          ])
          break;
        
        case 'update':
          this.database.updatePerson([
            data.name,
            data.designation,
            data.id,
          ])
          break;

        case 'delete':
          this.database.deletePerson(data.id);
          break;
          
        default: break;
      }
    });
  }

}
