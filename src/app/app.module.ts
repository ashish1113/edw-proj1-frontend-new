import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {BootstrapModalModule} from 'ng6-bootstrap-modal';
import { RouterModule, Routes} from '@angular/router';

import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';

import { AppComponent } from './app.component';

import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
//import { UserViewComponent } from './user-dashboard/user-view/user-view.component';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
    AppComponent,
   
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    SharedModule,
    UserModule,
    NgbModalModule,
    UserDashboardModule,
    BootstrapModalModule,

    HttpClientModule,
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full'},
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '*', component: LoginComponent},
      { path: '**', component: LoginComponent},
      
      //{ path: 'user-dashboard', component: UserViewComponent, pathMatch: 'full'}
    ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
