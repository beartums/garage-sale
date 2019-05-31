import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatItemListComponent } from './mat-item-list/mat-item-list.component';
import { MatItemEditComponent } from './mat-item-edit/mat-item-edit.component';
import { MatItemTilesComponent } from './mat-item-tiles/mat-item-tiles.component';
import { ShowItemComponent } from './show-item/show-item.component';

const routes: Routes = [
  { path: 'mat-item-list', component: MatItemListComponent},
  { path: 'mat-item-tiles', component: MatItemTilesComponent},
  { path: 'mat-item-edit/:key', component: MatItemEditComponent},
  { path: 'show-item/:itemId', component: ShowItemComponent},
  { path: '', redirectTo: '/mat-item-tiles', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
