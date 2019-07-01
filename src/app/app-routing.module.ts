import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemTilesComponent } from './item-tiles/item-tiles.component';
import { ShowItemComponent } from './show-item/show-item.component';
import { PATHS } from './shared/constants';
import { AdminViewComponent } from './admin-view/admin-view.component';

const routes: Routes = [
  { path: PATHS.listUrl, component: ItemListComponent},
  { path: PATHS.tilesUrl, component: ItemTilesComponent},
  { path: PATHS.editUrl + '/:key', component: ItemEditComponent},
  { path: PATHS.itemUrl + '/:itemId', component: ShowItemComponent},
  { path: PATHS.adminUrl, component: AdminViewComponent},
  { path: '', redirectTo: PATHS.tilesUrl, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
