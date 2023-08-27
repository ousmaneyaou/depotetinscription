import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FaculteComponent } from '../list/faculte.component';
import { FaculteDetailComponent } from '../detail/faculte-detail.component';
import { FaculteUpdateComponent } from '../update/faculte-update.component';
import { FaculteRoutingResolveService } from './faculte-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const faculteRoute: Routes = [
  {
    path: '',
    component: FaculteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FaculteDetailComponent,
    resolve: {
      faculte: FaculteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FaculteUpdateComponent,
    resolve: {
      faculte: FaculteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FaculteUpdateComponent,
    resolve: {
      faculte: FaculteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(faculteRoute)],
  exports: [RouterModule],
})
export class FaculteRoutingModule {}
