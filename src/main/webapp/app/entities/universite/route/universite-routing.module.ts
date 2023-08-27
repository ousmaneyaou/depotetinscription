import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UniversiteComponent } from '../list/universite.component';
import { UniversiteDetailComponent } from '../detail/universite-detail.component';
import { UniversiteUpdateComponent } from '../update/universite-update.component';
import { UniversiteRoutingResolveService } from './universite-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const universiteRoute: Routes = [
  {
    path: '',
    component: UniversiteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UniversiteDetailComponent,
    resolve: {
      universite: UniversiteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UniversiteUpdateComponent,
    resolve: {
      universite: UniversiteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UniversiteUpdateComponent,
    resolve: {
      universite: UniversiteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(universiteRoute)],
  exports: [RouterModule],
})
export class UniversiteRoutingModule {}
