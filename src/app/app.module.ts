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
import { AngularFireDatabaseModule } from "@angular/fire/database"


import { environment } from '../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, 
  MatIconModule, MatListModule, MatTableModule, MatPaginatorModule, 
  MatSortModule, MatInputModule, MatSelectModule, MatRadioModule, 
  MatCardModule, MatChipsModule, MatGridListModule, MatMenuModule, MatAutocompleteModule,
  MatBadgeModule, 
  MatTooltipModule,
  MatDialog,
  MatDialogModule,
  MatSlideToggleModule} from '@angular/material';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ItemService } from './item.service';
import { MatItemListComponent } from './mat-item-list/mat-item-list.component';
import { MatItemEditComponent } from './mat-item-edit/mat-item-edit.component';
import { MatItemTilesComponent } from './mat-item-tiles/mat-item-tiles.component';
import { MatItemComponent } from './mat-item/mat-item.component';
import { ItemCommentsComponent } from './item-comments/item-comments.component';
import { SettingsComponent } from './settings/settings.component';
import { ItemCommentsDialogComponent } from './item-comments-dialog/item-comments-dialog.component';
import { ShowItemComponent } from './show-item/show-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MatItemListComponent,
    MatItemEditComponent,
    MatItemTilesComponent,
    MatItemComponent,
    ItemCommentsComponent,
    SettingsComponent,
    ItemCommentsDialogComponent,
    ShowItemComponent,
    ContactUsComponent
  ],
  entryComponents: [ ItemCommentsComponent, SettingsComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'garage-sale-78809'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FontAwesomeModule,
    LayoutModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatMenuModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatButtonModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [AuthService, DataService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
