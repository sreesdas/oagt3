import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// User Services
import { DatabaseService } from './services/database.service';
import { ApiService } from './services/api.service';

// Native Services
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { ModalComponent } from './components/modal/modal.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';

@NgModule({
  declarations: [ AppComponent, ModalComponent ],
  entryComponents: [ ModalComponent ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    NativeStorage,
    SQLite,
    SqliteDbCopy,
    SpinnerDialog,
    CallNumber,
    Contacts,
    FileChooser,
    FileTransfer,
    File,
    DatabaseService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
