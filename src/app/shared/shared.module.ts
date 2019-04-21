import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FirstCharComponent } from './first-char/first-char.component';
import { PipeComponent } from './pipe/pipe.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserDetailsComponent, FirstCharComponent, PipeComponent],
  exports: [
    UserDetailsComponent,
    FirstCharComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
