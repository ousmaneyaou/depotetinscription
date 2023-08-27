import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BachelierComponent } from '../list/bachelier.component';
import { BachelierDetailComponent } from '../detail/bachelier-detail.component';
import { BachelierUpdateComponent } from '../update/bachelier-update.component';
import { BachelierRoutingResolveService } from './bachelier-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bachelierRoute: Routes = [
  {
    path: '',
    component: BachelierComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BachelierDetailComponent,
    resolve: {
      bachelier: BachelierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BachelierUpdateComponent,
    resolve: {
      bachelier: BachelierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BachelierUpdateComponent,
    resolve: {
      bachelier: BachelierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bachelierRoute)],
  exports: [RouterModule],
})
export class BachelierRoutingModule {}
