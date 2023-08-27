import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DepotComponent } from '../list/depot.component';
import { DepotDetailComponent } from '../detail/depot-detail.component';
import { DepotUpdateComponent } from '../update/depot-update.component';
import { DepotRoutingResolveService } from './depot-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const depotRoute: Routes = [
  {
    path: '',
    component: DepotComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DepotDetailComponent,
    resolve: {
      depot: DepotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DepotUpdateComponent,
    resolve: {
      depot: DepotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DepotUpdateComponent,
    resolve: {
      depot: DepotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(depotRoute)],
  exports: [RouterModule],
})
export class DepotRoutingModule {}
