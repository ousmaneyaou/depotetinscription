import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UniversiteComponent } from './list/universite.component';
import { UniversiteDetailComponent } from './detail/universite-detail.component';
import { UniversiteUpdateComponent } from './update/universite-update.component';
import { UniversiteDeleteDialogComponent } from './delete/universite-delete-dialog.component';
import { UniversiteRoutingModule } from './route/universite-routing.module';

@NgModule({
  imports: [SharedModule, UniversiteRoutingModule],
  declarations: [UniversiteComponent, UniversiteDetailComponent, UniversiteUpdateComponent, UniversiteDeleteDialogComponent],
})
export class UniversiteModule {}
