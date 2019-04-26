import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit, OnDestroy {


  public currentEventId;
  public currentEvent;

  public email: string;
  public eventTitle: string;
  public mobileNumber: number;
  public startDate: any;
  public endDate: any
  public startHours: any;
  public startMins: any;
  public endHours: any;
  public endMins: any;
  public eventLocation: string;
  public eventDescription: string;
  public authToken: string;
  constructor(public appService: AppService, public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router, public SocketService: SocketService) {

  }

  ngOnInit() {

    this.currentEventId = Cookie.get('eventSelected');
    if (this.currentEventId  === undefined || this.currentEventId  === '' || this.currentEventId  === null) {
      this.toastr.errorToastr('select an event to edit');
      this.router.navigate(['/admin-view']);
    }
    this.getEventInfoInFormtion(this.currentEventId);


    
    //  this.appService.getSingleEventInformation(this.currentEventId).subscribe(result=>{
    //   console.log("result of current event id: ",)
    //   let sd = new Date(result.data.startTime)
    //   let ed = new Date(result.data.endTime)
    //   let startDate = sd.toLocaleDateString();
    //   let startDateTODisplay = startDate.split("/").reverse().join("-")
    //   let endDate = ed.toLocaleDateString();
    //   let endDateToDisplay = endDate.split("/").reverse().join("-")


    //   this.email = result.data.userEmail;
    //   this.eventTitle = result.data.eventTitle;
    //   this.mobileNumber = result.data.userMobileNumber;
    //   this.startDate = startDateTODisplay;
    //   this.endDate=endDateToDisplay;
    //   this.startHours= sd.getHours();
    //   this.startMins = sd.getMinutes();
    //   this.endHours = ed.getHours();
    //   this.endMins = ed.getMinutes();
    //   this.eventLocation = result.data.eventLocation;
    //   this.eventDescription=result.data.eventDescription;


    // },
    // error =>{
    //   this.toastr.errorToastr('This is error toast.', 'Oops!');
    // })


  }

  public getEventInfoInFormtion = (currentEventid) => {


    this.appService.getSingleEventInformation(currentEventid).subscribe(result => {
      if (currentEventid  === undefined || currentEventid  === '' || currentEventid  === null) {
        //this.toastr.errorToastr('select an event to edit');
        this.router.navigate(['/admin-view']);
      }
      else{
      

      let sd = new Date(result.data.startTime)
      let ed = new Date(result.data.endTime)
      let startDate = sd.toLocaleDateString();
      let startDateTODisplay = startDate.split("/").reverse().join("-")
      let endDate = ed.toLocaleDateString();
      let endDateToDisplay = endDate.split("/").reverse().join("-")


      this.email = result.data.userEmail;
      this.eventTitle = result.data.eventTitle;
      this.mobileNumber = result.data.userMobileNumber;
      this.startDate = startDateTODisplay;
      this.endDate = endDateToDisplay;
      this.startHours = sd.getHours();
      this.startMins = sd.getMinutes();
      this.endHours = ed.getHours();
      this.endMins = ed.getMinutes();
      this.eventLocation = result.data.eventLocation;
      this.eventDescription = result.data.eventDescription;

      //  let startYear = (this.startDate).getFullYear();
      //  let startMonth = (this.startDate).getMonth();
      //  let startDate1 = (this.startDate).getDate();

      // let StartTime = new Date(startYear,startMonth+1,startDate1,this.startHours,this.startMins);

      // console.log("start time in utc format is :", StartTime.toUTCString());

      // let endYear = this.endDate.getFullYear();
      // let endMonth = this.endDate.getMonth();
      // let endDate1 = this.endDate.getDate();

      }

      


    })
  }

  public editThisEvent(): any {
    if (this.currentEventId  === undefined || this.currentEventId  === '' || this.currentEventId  === null) {
      this.toastr.errorToastr('select an event to edit');
    }
    else {
      console.log("main startdate",this.startDate)
      let startdate = new Date(this.startDate.toString());
      console.log("startdate",startdate);
      let startyear = startdate.getFullYear();
      console.log("startYear",startyear)
      let startmonth = startdate.getMonth();
      let startdateonly = startdate.getDate();
      let startTime = new Date(startyear, startmonth, startdateonly, this.startHours, this.startMins, 0, 0);
      console.log("startTime",startTime)
      let enddate = new Date (this.endDate.toString());
      let endyear = enddate.getFullYear();
      let endmonth = enddate.getMonth();
      let enddateonly = enddate.getDate();
      let endTime =  new Date(endyear,endmonth,enddateonly, this.endHours, this.endMins,0,0);
      console.log("endTime",endTime)

      let currentEvent = {
        Email: this.email,
        Title: this.eventTitle,
        MobileNumber: this.mobileNumber,
        // StartDate: this.startDate,
        // EndDate: this.endDate,
        Location: this.eventLocation,
        Description: this.eventDescription,
        // StartHours: this.startHours,
        // StartMins: this.startMins,
        // EndHours: this.endHours,
        // EndMins: this.endMins,
        StartTime : startTime,
        EndTime : endTime

      }
      console.log("currentEvent",currentEvent)
      this.appService.EditEvent(this.currentEventId, currentEvent).subscribe(
        data => {
          this.toastr.successToastr('event edited .', 'Success!');
          this.SocketService.toSendRequestToGetNotificationFromServerOnEdit(this.email);

          setTimeout(() => {
            this.router.navigate(['/admin-view']);
          }, 1000)
        },
        error => {
          this.toastr.errorToastr('This is error toast.', 'Oops!');
        }

      )
    }
  }

  public goBack(){
    this.router.navigate(['/admin-view']);
  }

  ngOnDestroy() {
    Cookie.delete('eventSelected');
  }


}
