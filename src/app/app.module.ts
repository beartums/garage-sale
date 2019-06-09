import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';


import { environment } from '../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { MessageCenterModule } from './message-center/message-center.module';
import { ItemCommentsModule } from './item-comments/item-comments.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ItemService } from './item.service';
import { MatItemListComponent } from './mat-item-list/mat-item-list.component';
import { MatItemEditComponent } from './mat-item-edit/mat-item-edit.component';
import { MatItemTilesComponent } from './mat-item-tiles/mat-item-tiles.component';
import { MatItemComponent } from './mat-item/mat-item.component';
import { SettingsComponent } from './settings/settings.component';
import { ShowItemComponent } from './show-item/show-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MessageNavDialogComponent } from './message-center/message-center-dialog/message-center-dialog.component';
import { MaterialModule } from './material/material.module';
import { ItemCommentsComponent } from './item-comments/item-comments/item-comments.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { UncleanHtmlPipe } from './unclean-html.pipe';
import { MatTabsModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MatItemListComponent,
    MatItemEditComponent,
    MatItemTilesComponent,
    MatItemComponent,
    SettingsComponent,
    ShowItemComponent,
    ContactUsComponent,
    FilterDialogComponent,
    InfoPageComponent,
    UncleanHtmlPipe,
  ],
  entryComponents: [ ItemCommentsComponent, SettingsComponent, FilterDialogComponent, 
                    ContactUsComponent,  MessageNavDialogComponent, InfoPageComponent ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'garage-sale-78809'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FontAwesomeModule, ItemCommentsModule,
    MessageCenterModule, MaterialModule,
    MatTabsModule, 
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [AuthService, DataService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
