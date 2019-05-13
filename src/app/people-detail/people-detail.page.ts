import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, People } from '../services/database.service';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.page.html',
  styleUrls: ['./people-detail.page.scss'],
})
export class PeopleDetailPage implements OnInit {

  id: string;
  item: People;
  contacts: any = [];

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService
  ) { 

    // this.item = {
    //   cpf: '',
    //   name: '',
    //   designation: '',
    //   avatar: '',
    //   mobile: '',
    //   office_ext: '',
    //   office_alt: '',
    //   residence_ext: '',
    //   residence_alt: '',
    //   address: '',
    //   email: '',
    //   carrier: ''
    // };
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.database.getDatabaseState().subscribe( ready => {
      if(ready){
        this.database.readSinglePerson(this.id).then( data => {
          this.item = data;
          this.contacts = [
            { 'name': 'Office Ext.', 'number' : this.item.office_ext },
            { 'name': 'Office', 'number' : this.item.office_alt },
            { 'name': 'Residence Ext.', 'number' : this.item.residence_ext },
            { 'name': 'Residence', 'number' : this.item.residence_alt }
          ]
        })
      }
    })
  }

}
