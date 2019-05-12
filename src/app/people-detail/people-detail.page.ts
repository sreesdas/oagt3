import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.page.html',
  styleUrls: ['./people-detail.page.scss'],
})
export class PeopleDetailPage implements OnInit {

  id: string;

  item = {
    name: 'Sreenath S Das',
    designation: 'EE Elex',
    avatarUrl: 'https://media.licdn.com/dms/image/C4E03AQGkbJUl1E4VFA/profile-displayphoto-shrink_200_200/0?e=1562198400&v=beta&t=2QLNjqcMnSdqOQrQAYFydQWNfPHGUVrUSIiQF4CfXHg',
    carrier: 'Airtel',
    mobile: '8259950403',
    office: '3311',
    office_alt: '2363451',
    residence: '4106',
    residence_alt: '2373311',
    address: 'B109, North Colony',
    email: 'Das_Sreenath@ongc.co.in',
    birthday: '',
  }

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.database.getDatabaseState().subscribe( ready => {
      if(ready){
        this.database.readSinglePerson(this.id).then( data => {
          this.item.name = data.name;
          this.item.designation = data.designation;
        })
      }
    })
  }

  add() {
    let p = [4, 'Himanshu Martoliya', 'M(Prog'];
    this.database.addPerson(p);
  }

}
