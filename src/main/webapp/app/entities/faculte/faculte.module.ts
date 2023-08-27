import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FaculteComponent } from './list/faculte.component';
import { FaculteDetailComponent } from './detail/faculte-detail.component';
import { FaculteUpdateComponent } from './update/faculte-update.component';
import { FaculteDeleteDialogComponent } from './delete/faculte-delete-dialog.component';
import { FaculteRoutingModule } from './route/faculte-routing.module';

@NgModule({
  imports: [SharedModule, FaculteRoutingModule],
  declarations: [FaculteComponent, FaculteDetailComponent, FaculteUpdateComponent, FaculteDeleteDialogComponent],
})
export class FaculteModule {}
