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

import { AuthService } from './shared/auth.service';
import { DataService } from './shared/data.service';
import { ItemService } from './shared/item.service';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemTilesComponent } from './item-tiles/item-tiles.component';
import { ItemComponent } from './item/item.component';
import { SettingsComponent } from './settings/settings.component';
import { ShowItemComponent } from './show-item/show-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MessageNavDialogComponent } from './message-center/message-center-dialog/message-center-dialog.component';
import { MaterialModule } from './material/material.module';
import { ItemCommentsComponent } from './item-comments/item-comments/item-comments.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { UncleanHtmlPipe } from './shared/unclean-html.pipe';
import { MatTabsModule, MatSliderModule } from '@angular/material';
import { ItemPicsComponent } from './item-pics/item-pics.component';
import { EmailComponent } from './email/email.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { EgFocusDirective } from './shared/eg-focus.directive';
import { GenericDialogComponent } from './generic-dialog/generic-dialog.component';
import { SearchBoxComponent } from './search-box/search-box.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ItemListComponent,
    ItemEditComponent,
    ItemTilesComponent,
    ItemComponent,
    SettingsComponent,
    ShowItemComponent,
    ContactUsComponent,
    FilterDialogComponent,
    InfoPageComponent,
    UncleanHtmlPipe,
    ItemPicsComponent,
    EmailComponent,
    AdminViewComponent,
    EgFocusDirective,
    GenericDialogComponent,
    SearchBoxComponent,
  ],
  entryComponents: [ ItemCommentsComponent, SettingsComponent, FilterDialogComponent, 
                    ContactUsComponent,  MessageNavDialogComponent, InfoPageComponent,
                  ItemPicsComponent, EmailComponent, GenericDialogComponent ],
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
    FontAwesomeModule, ItemCommentsModule, HttpClientModule,
    MessageCenterModule, MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [AuthService, DataService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
