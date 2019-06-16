import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, 
  MatIconModule, MatListModule, MatTableModule, MatPaginatorModule, 
  MatSortModule, MatInputModule, MatSelectModule, MatRadioModule, 
  MatCardModule, MatChipsModule, MatGridListModule, MatMenuModule, MatAutocompleteModule,
  MatBadgeModule, MatTooltipModule, MatDialogModule, MatSlideToggleModule,
  MatTreeModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatSliderModule,
  MatTabsModule,
  MatSnackBarModule} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, LayoutModule, FlexLayoutModule, MatToolbarModule,
    MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,
    MatSelectModule, MatRadioModule, MatCardModule, MatChipsModule,
    MatBadgeModule, MatGridListModule, MatMenuModule, MatTooltipModule,
    MatAutocompleteModule, MatDialogModule, MatSlideToggleModule, MatButtonModule,
    MatTreeModule, MatProgressSpinnerModule, MatExpansionModule, 
    MatTabsModule, MatSliderModule, MatSnackBarModule
  ],
  exports: [
    CommonModule, LayoutModule, FlexLayoutModule, MatToolbarModule,
    MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,
    MatSelectModule, MatRadioModule, MatCardModule, MatChipsModule,
    MatBadgeModule, MatGridListModule, MatMenuModule, MatTooltipModule,
    MatAutocompleteModule, MatDialogModule, MatSlideToggleModule, MatButtonModule,
    MatTreeModule, MatProgressSpinnerModule, MatExpansionModule,
    MatTabsModule, MatSliderModule, MatSnackBarModule
  ]
})
export class MaterialModule { }
