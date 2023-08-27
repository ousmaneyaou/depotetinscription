import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BachelierComponent } from './list/bachelier.component';
import { BachelierDetailComponent } from './detail/bachelier-detail.component';
import { BachelierUpdateComponent } from './update/bachelier-update.component';
import { BachelierDeleteDialogComponent } from './delete/bachelier-delete-dialog.component';
import { BachelierRoutingModule } from './route/bachelier-routing.module';

@NgModule({
  imports: [SharedModule, BachelierRoutingModule],
  declarations: [BachelierComponent, BachelierDetailComponent, BachelierUpdateComponent, BachelierDeleteDialogComponent],
})
export class BachelierModule {}
