import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

export interface People {
  cpf: string,
  name: string,
  designation: string,
  avatar: string,
  mobile: string,
  office_ext: string,
  office_alt: string,
  residence_ext: string,
  residence_alt: string,
  address: string,
  email: string,
  carrier: string
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  people = new BehaviorSubject([]);
  person = new BehaviorSubject({});

  constructor(
    private sqlite: SQLite,
    private sqliteDbCopy: SqliteDbCopy,
    private plt: Platform,
    private nativeStorage: NativeStorage
  ) { 

    plt.ready().then(()=>{
      this.nativeStorage.getItem('database')
      .then(
        data => {
          if( data.copied == 'true' ) {
            this.createDB(); // initialize db everytime the app opens
          } else {
            this.copyDB(); // copy the prepopulated db from www dir to app storage, ( only one time )
          }
        },
        error => {
          console.log(JSON.stringify(error))
          this.copyDB();
        }
      );
    });

  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getPeople(): Observable<People[]> {
    return this.people.asObservable();
  }

  getPerson(): Observable<any> {
    return this.person.asObservable();
  }

  copyDB() {
    this.sqliteDbCopy.copy('sample.db', 0)
    .then((res: any) => { 
      console.log(JSON.stringify(res)); 
      this.createDB();
      this.nativeStorage.setItem('database', { copied: 'true', version: '1.0' })
    })
    .catch((error: any) => console.error(JSON.stringify(error)));
  }

  createDB() {
    this.sqlite.create({
      name: 'sample.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.db = db;
      this.readAllPeople();
      this.dbReady.next(true);
    })
    .catch(e => console.log(e));
  }

  readAllPeople() {
    let people: People[] = [];
    
    this.db.executeSql('select * from people', [])
    .then((data) => {
      if( data.rows.length > 0) {
        for(var i=0; i<data.rows.length; ++i ) {
          people.push({
            cpf: data.rows.item(i).cpf,
            name: data.rows.item(i).name,
            designation: data.rows.item(i).designation,
            avatar: data.rows.item(i).avatar,
            mobile: data.rows.item(i).mobile,
            office_ext: data.rows.item(i).office_ext,
            office_alt: data.rows.item(i).office_alt,
            residence_ext: data.rows.item(i).residence_ext,
            residence_alt: data.rows.item(i).residence_alt,
            address: data.rows.item(i).address,
            email: data.rows.item(i).email,
            carrier: data.rows.item(i).carrier
          });
        }
      }
      this.people.next(people);
    })
    .catch(e => console.log(e));
  }

  readSinglePerson(id:string): Promise<any> {
    return this.db.executeSql('select * from people where cpf=?', [id])
    .then((data) => {

      return {
        cpf: data.rows.item(0).cpf,
        name: data.rows.item(0).name,
        designation: data.rows.item(0).designation,
        avatar: data.rows.item(0).avatar,
        mobile: data.rows.item(0).mobile,
        office_ext: data.rows.item(0).office_ext,
        office_alt: data.rows.item(0).office_alt,
        residence_ext: data.rows.item(0).residence_ext,
        residence_alt: data.rows.item(0).residence_alt,
        address: data.rows.item(0).address,
        email: data.rows.item(0).email,
        carrier: data.rows.item(0).carrier
      };

    })
    .catch(e => console.log(e));
  }

  updatePerson(person: any) {
    let data:any = person; //[ person.name, person.designation ];
    this.db.executeSql(`
      update people set name=?, designation=?, avatar=?, mobile=?,
      office_ext=?, office_alt=?, residence_ext=?, residence_alt=?, address=?, 
      email=?, carrier=? where cpf=?
      `, data ).then(res => {
      this.readAllPeople();
      console.log("Updated Person " + JSON.stringify(res) )
    })
    .catch(e => console.log(JSON.stringify(e)));
  }

  deletePerson(id:string) {
    this.db.executeSql('delete from people where id=?', [id] ).then(res => {
      this.readAllPeople();
      console.log("Deleted " + id )
    })
    .catch(e => console.log(JSON.stringify(e)));
  }

  addPerson(person: any) {

    console.log(JSON.stringify(person));

    let data:any = person; //[person.id, person.name, person.designation];
    this.db.executeSql(`
      insert into people( cpf, name, designation, avatar, mobile,
      office_ext, office_alt, residence_ext, residence_alt, address, 
      email, carrier ) 
      values(?,?,?,?,?,?,?,?,?,?,?,?)
      `, data ).then(res => {
      this.readAllPeople();
      console.log('Added Person!' + JSON.stringify(res));
    })
    .catch(e => console.log(JSON.stringify(e)));
  }
}
