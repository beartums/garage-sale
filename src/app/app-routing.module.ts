import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatItemListComponent } from './mat-item-list/mat-item-list.component';
import { MatItemEditComponent } from './mat-item-edit/mat-item-edit.component';
import { MatItemTilesComponent } from './mat-item-tiles/mat-item-tiles.component';
import { ShowItemComponent } from './show-item/show-item.component';
import { PATHS } from './constants';
import { AdminViewComponent } from './admin-view/admin-view.component';

const routes: Routes = [
  { path: PATHS.listUrl, component: MatItemListComponent},
  { path: PATHS.tilesUrl, component: MatItemTilesComponent},
  { path: PATHS.editUrl + '/:key', component: MatItemEditComponent},
  { path: PATHS.itemUrl + '/:itemId', component: ShowItemComponent},
  { path: PATHS.adminUrl, component: AdminViewComponent},
  { path: '', redirectTo: PATHS.tilesUrl, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
