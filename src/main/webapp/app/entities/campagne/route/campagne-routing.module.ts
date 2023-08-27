import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CampagneComponent } from '../list/campagne.component';
import { CampagneDetailComponent } from '../detail/campagne-detail.component';
import { CampagneUpdateComponent } from '../update/campagne-update.component';
import { CampagneRoutingResolveService } from './campagne-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const campagneRoute: Routes = [
  {
    path: '',
    component: CampagneComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CampagneDetailComponent,
    resolve: {
      campagne: CampagneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CampagneUpdateComponent,
    resolve: {
      campagne: CampagneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CampagneUpdateComponent,
    resolve: {
      campagne: CampagneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(campagneRoute)],
  exports: [RouterModule],
})
export class CampagneRoutingModule {}
