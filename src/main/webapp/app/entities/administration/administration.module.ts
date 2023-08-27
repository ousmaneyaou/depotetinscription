import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdministrationComponent } from './list/administration.component';
import { AdministrationDetailComponent } from './detail/administration-detail.component';
import { AdministrationUpdateComponent } from './update/administration-update.component';
import { AdministrationDeleteDialogComponent } from './delete/administration-delete-dialog.component';
import { AdministrationRoutingModule } from './route/administration-routing.module';

@NgModule({
  imports: [SharedModule, AdministrationRoutingModule],
  declarations: [
    AdministrationComponent,
    AdministrationDetailComponent,
    AdministrationUpdateComponent,
    AdministrationDeleteDialogComponent,
  ],
})
export class AdministrationModule {}
