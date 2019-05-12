import { Component } from '@angular/core';

import { Platform, NavController, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private api: ApiService,
    private router: Router,
    private navController: NavController,
    private nativeStorage: NativeStorage,
    private alertController: AlertController,
    private toastController: ToastController,
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
          type: 'text',
          placeholder: 'CPF Number'
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
            this.nativeStorage.setItem('cachedCredentials', { cpf: data.cpf, lastLoggedIn: 'now()' })
            .then(
              () => {
                alert.dismiss();
                console.log('Stored item!');
              },
              error => console.error('Error storing item', error)
            );
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
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

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      // header: 'Are you sure',
      duration: 3000,
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
