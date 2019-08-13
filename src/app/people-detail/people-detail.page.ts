import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, People } from '../services/database.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { ToastController } from '@ionic/angular';

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
    private database: DatabaseService,
    private callNumber: CallNumber,
    private contactPlugin: Contacts,
    private toastController: ToastController,
  ) { 

    this.item = {
      cpf: '128238',
      name: 'sree',
      designation: 'ee',
      avatar: '',
      mobile: '1234',
      office_ext: '1234',
      office_alt: '',
      residence_ext: '',
      residence_alt: '',
      address: '',
      email: '',
      carrier: ''
    };
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.database.getDatabaseState().subscribe( ready => {
      if(ready){
        this.database.readSinglePerson(this.id);
        this.database.getPerson().subscribe( data => {
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

  call( number: string ) {

    let _number = number;

    switch (number.length) {
      case 4:
        _number = "+91381236" + number;
        break;
      case 7:
        _number = "+91381" + number;
        break;
      case 10:
        _number = "+91" + number;
        break;
      default:
        _number = number;
        break;
    }

    this.callNumber.callNumber( _number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));

    this.database.addFavorite(this.item.cpf);
  }

  save() {
    
    let contact: Contact = this.contactPlugin.create();

    contact.name = new ContactName(null, this.item.name, '');
    contact.phoneNumbers = [ new ContactField('mobile', this.item.mobile) ];

    contact.save().then(
      () => this.presentToast('Contact saved'),
      (error: any) => this.presentToast('Error saving contact!')
    )
  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      duration: 2500,
      message: message,
      position: 'bottom',
    });
    toast.present();
  }

}
