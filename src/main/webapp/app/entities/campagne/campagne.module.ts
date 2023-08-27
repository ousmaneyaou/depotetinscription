import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CampagneComponent } from './list/campagne.component';
import { CampagneDetailComponent } from './detail/campagne-detail.component';
import { CampagneUpdateComponent } from './update/campagne-update.component';
import { CampagneDeleteDialogComponent } from './delete/campagne-delete-dialog.component';
import { CampagneRoutingModule } from './route/campagne-routing.module';

@NgModule({
  imports: [SharedModule, CampagneRoutingModule],
  declarations: [CampagneComponent, CampagneDetailComponent, CampagneUpdateComponent, CampagneDeleteDialogComponent],
})
export class CampagneModule {}
