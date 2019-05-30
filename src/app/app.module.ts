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
  MatTooltipModule} from '@angular/material';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ItemService } from './item.service';
import { MatItemListComponent } from './mat-item-list/mat-item-list.component';
import { MatItemEditComponent } from './mat-item-edit/mat-item-edit.component';
import { MatItemTilesComponent } from './mat-item-tiles/mat-item-tiles.component';
import { MatItemComponent } from './mat-item/mat-item.component';
import { DisplayItemComponent } from './display-item/display-item.component';
import { ItemCommentsComponent } from './item-comments/item-comments.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MatItemListComponent,
    MatItemEditComponent,
    MatItemTilesComponent,
    MatItemComponent,
    DisplayItemComponent,
    ItemCommentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig,'garage-sale-78809'),
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
  ],
  providers: [AuthService, DataService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
