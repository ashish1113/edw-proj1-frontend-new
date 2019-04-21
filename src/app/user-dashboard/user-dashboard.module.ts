import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ToastrModule } from 'ng6-toastr-notifications';

import { UserViewComponent } from './user-view/user-view.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { ViewRouteGuardService } from './view-route-gaurd.service';
import { AdminViewRouteGuardService } from './admin-view-route-gaurd.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild([
      { path:'user-view', component: UserViewComponent,canActivate:[ViewRouteGuardService]},
      { path:'admin-view', component: AdminViewComponent,canActivate:[AdminViewRouteGuardService]},
      { path:'create', component:CreateEventComponent},
      // { path:'edit/:eventId', component:EditEventComponent},
      // { path:'delete/:eventId', component:DeleteEventComponent},
      { path:'edit', component:EditEventComponent},
      { path:'delete', component:DeleteEventComponent},

    ])
  ],
  declarations: [UserViewComponent, AdminViewComponent, CreateEventComponent, EditEventComponent, DeleteEventComponent],
  providers: [ViewRouteGuardService,AdminViewRouteGuardService]
})
export class UserDashboardModule { }
