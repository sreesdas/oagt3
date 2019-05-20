import { Component } from '@angular/core';

import { Platform, NavController, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navController: NavController,
    private nativeStorage: NativeStorage,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    this.initializeApp();
    this.statusBar.styleBlackTranslucent();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Login to continue',
      backdropDismiss: false,
      animated: true,
      // subHeader: 'Login',
      inputs: [
        {
          name: 'cpf',
          type: 'number',
          placeholder: 'CPF No.'
        },
        {
          name: 'mobile',
          type: 'number',
          placeholder: 'Mobile No.'
        }
      ],
      buttons: [
        {
          text: 'Login',
          handler: (data) => {
            
            this.http.post('https://oagtapp.xyz/apis/login.php', {
              cpf: data.cpf,
              mobile: data.mobile
            })
            .subscribe( res => {
                if( res['status'] == 'success' ){
                  console.log( JSON.stringify(res) );

                  this.nativeStorage.setItem('cachedCredentials', { cpf: data.cpf, lastLoggedIn: 'now()' })
                  .then(
                    () => {
                      alert.dismiss();
                      console.log('Stored item!');
                    },
                    error => console.error('Error storing item', error)
                  );
                } else {
                  this.presentToast();
                }
            })

            return false;

          }
        }
      ]
    });

    await alert.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();

      this.nativeStorage.getItem('cachedCredentials')
      .then(
        data => {
          if( !data.cpf ) {
            this.presentAlertPrompt();
          }
        },
        error => {
          console.log(JSON.stringify(error))
          this.presentAlertPrompt();
        }
      );

      this.platform.backButton.subscribe(()=>{
        let url = this.router.url;
        console.log(url);
        if (url.match("(^\/tabs\/.*)$")) {
          this.presentToastWithOptions();
        } else {
          this.navController.navigateBack(url.replace(new RegExp("(\/([a-zA-Z0-9\-\.])*)$"), ""));
        }
      })

    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      duration: 2500,
      message: 'Invalid Credentials',
      position: 'bottom',
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      // header: 'Are you sure',
      duration: 2500,
      message: 'Do you really want to exit?',
      position: 'bottom',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            console.log('OK clicked');
            navigator['app'].exitApp();
            return false;
          }
        }
      ]
    });
    toast.present();
  }
}
