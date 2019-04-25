import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  constructor(public appService: AppService,public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router) { 

  }


  public email: string ;
  public eventTitle: string;
  public userMobileNumber: any;
  public startDate: Date;
  public endDate: Date;
  public startHours: string;
  public startMins: string;
  public endHours: string;
  public endMins: string;
  public eventLocation: string;
  public eventDescription: string;
  public authToken: string;
  //public eventSelected: string;



  ngOnInit() {
    this.authToken = Cookie.get('authtoken');
    this.email= Cookie.get('userSelectedUsername');
    //this.eventSelected= Cookie.get('eventSelected');

  }

  
  
  public createEvent(): any{
    let eventData = {
      Email: this.email,
      Title: this.eventTitle,
      MobileNumber : this.userMobileNumber,
      StartDate: this.startDate,
      EndDate: this.endDate,
      StartHours: this.startHours,
      StartMins: this.startMins,
      EndHours: this.endHours,
      EndMins: this.endMins,
      Location: this.eventLocation,
      Description: this.eventDescription,
      authToken: this.authToken
    }
    
      

    this.appService.createEvent(eventData).subscribe(
      data =>{
        console.log("event created")
        console.log("create event response data: ",data);
        this.toastr.successToastr('event created.', 'Success!');

        setTimeout(()=>{
          this.router.navigate(['/admin-view']);
        },1000)
      },
      error=>{
        console.log("some error occurred while creating event");
        console.log(error.errorMessage);
        this.toastr.errorToastr('This is error toast.', 'Oops!');
      }
    )
    
    
  }

  public goBack(){
    this.router.navigate(['/admin-view']);
  }


}
