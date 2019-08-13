import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public contacts = [
    { name: 'Fire Control Room', short_number: '3456', full_number: '+913812363456' },
    { name: 'Security Control Room', short_number: '3005', full_number: '+913812363005' },
    { name: 'LV Control Room', short_number: '3003', full_number: '+913812363003' },
    { name: 'HV Control Room', short_number: '3004', full_number: '+913812363004' },
    { name: 'Civil Maintenance', short_number: '3331', full_number: '+913812363331' },
    { name: 'Electrical Maintenance', short_number: '3334', full_number: '+913812363334' },
    { name: 'IT Helpdesk', short_number: '3333', full_number: '+913812363333' },
    { name: 'Telephone Complaints', short_number: '3332', full_number: '+913812363332' },
  ];

  constructor(
    private callNumber: CallNumber,
  ) {

  }

  call( contact:any ) {
    this.callNumber.callNumber( contact.full_number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
