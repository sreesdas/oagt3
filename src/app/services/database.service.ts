import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export interface People {
  id: number,
  name: string,
  designation: string,
  avatar: string,
  mobile: string,
  office_ext: string,
  office_alt: string,
  residence_ext: string,
  residence_alt: string,
  address: string,
  email: string
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
    private plt: Platform
  ) { 

    plt.ready().then(()=>{
        this.createDB()
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
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            designation: data.rows.item(i).designation,
            avatar: '',
            mobile: '',
            office_ext: '',
            office_alt: '',
            residence_ext: '',
            residence_alt: '',
            address: '',
            email: ''
          });
        }
      }
      this.people.next(people);
    })
    .catch(e => console.log(e));
  }

  readSinglePerson(id:string): Promise<any> {
    return this.db.executeSql('select * from people where id=?', [id])
    .then((data) => {

      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name,
        designation: data.rows.item(0).designation
      };

    })
    .catch(e => console.log(e));;
  }

  updatePerson(person: any) {
    let data:any = person; //[ person.name, person.designation ];
    this.db.executeSql(`update people set name=?, designation=? where id=?`, data ).then(res => {
      this.readAllPeople();
      console.log("Updated Person " + JSON.stringify(res) )
    })
  }

  deletePerson(id:string) {
    this.db.executeSql('delete from people where id=?', [id] ).then(res => {
      this.readAllPeople();
      console.log("Deleted " + id )
    })
  }

  addPerson(person: any) {

    let data:any = person; //[person.id, person.name, person.designation];
    this.db.executeSql('insert into people(id, name, designation) values(?,?,?)', data ).then(res => {
      this.readAllPeople();
      console.log('Added Person!' + JSON.stringify(res));
    });
  }
}
