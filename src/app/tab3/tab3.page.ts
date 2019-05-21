import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { DatabaseService, People } from '../services/database.service';
import { ApiService } from '../services/api.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'; 

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  item: People;
  url: string;

  constructor(
    private nativeStorage: NativeStorage,
    private plt: Platform,
    private database: DatabaseService,
    private api: ApiService,
    private spinner: SpinnerDialog,
    private fileChooser: FileChooser,
    private transfer: FileTransfer, 
    private file: File,
    private toastController: ToastController,
    private alertController: AlertController
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

  open() {
    this.fileChooser.open()
    .then(uri => {
      this.url = uri;
      console.log(uri);
      this.spinner.show();
      this.upload();
    })
    .catch(e => console.log(e));
  }

  upload() {

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.item.cpf + '.jpg',
      mimeType: 'image/jpeg',
      params: {},
      headers: {}
    }

    const cloudUrl = "https://oagtapp.xyz/apis/uploadProfileImage.php";
    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload( this.url, cloudUrl, options)
      .then((data) => {
        let d = JSON.parse(data.response);
        if( d.status == 'success') {
          this.presentToast('Succesfully Uploaded');
        } else {
          this.presentToast('Upload failed!');
        }
        this.spinner.hide();
      }, (err) => {
        console.log(JSON.stringify(err));
        this.presentToast('Upload failed!');
        this.spinner.hide();
      }) 
      .catch((e) => {
        console.log(JSON.stringify(e));
        this.presentToast('Upload failed!');
        this.spinner.hide();
      });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      duration: 2500,
      message: msg,
      position: 'bottom',
    });
    toast.present();
  }
  
}
