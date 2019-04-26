import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngb-modal';
import { collapseAnimation } from 'angular-calendar';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';

import { ChangeDetectorRef } from '@angular/core'
import { not } from 'rxjs/internal/util/not';
import * as bootstrap from 'bootstrap';





const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  //providers: [SocketService],
  animations: [collapseAnimation],
  providers: [SocketService,AppService]
})
export class UserViewComponent implements OnInit ,OnDestroy {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();




  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
  // };

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fa fa-fw fa-pencil"></i>',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     }
  //   },
  //   {
  //     label: '<i class="fa fa-fw fa-times"></i>',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.events = this.events.filter(iEvent => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     }
  //   }
  // ];

  refresh: Subject<any> = new Subject();

  eventlist1: any = [];

  events: CalendarEvent[]
  //  = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: '',
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: new Date(),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }
  // ];

  activeDayIsOpen: boolean 
  //modal: any;

  public authToken: any;
  public userInfo: any;
  //public receiverId: any;
  //public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  socketid: any;
  public dayViewToken = false;
  userSelectedUsername: string ;
  userSelectedemail: string;
  userSelectedfullName: string;
  screenWidth: any;
  viewToken: boolean;
  checkForEventsOnDateList: any = [];
  noEvents: boolean =true;
  tokenForDayView: boolean;
  selectedEventToken: boolean = false;
  emmissionFunction;
  arrayToSendNotification:  any =[];


  //variables to be displayed in notification

  public eventTitle : any;
  public startTime : any;
  public placeOfEvent : any;
  public eventId : any;
  snoozedNotificationList: any = [];
  snoozedNotificationFunction;
  snoozeArray: any;
  snoozeTitle: any;
  snoozeStartTime: any;
  snoozePlace: any;
  snoozeEventId: any;

  public EventIdOfSelectedEvent: string;
  public MobileNumberOfSelectedEvent: any;
  public CreatedOnOfSelectedEvent: any;
  public CreatedByOfSelectedEvent: string;
  public EventTitleOfSelectedEvent: string;
  public EventLocationOfSelectedEvent: string;
  public EventDescriptionOfSelectedEvent: string;
  public UserEmailOfSelectedEvent: string;
  public StartTimeOfSelectedEvent: any;
  public EndTimeOfSelectedEvent: any;
  public EventDurationOfSelectedEvent: any;
  
   

  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastrManager,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    console.log(this.viewDate + "-- ");
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    this.dayViewToken = true;
      this.view = CalendarView.Day;
      console.log(this.eventlist1);
      this.changeDetectorRef.detectChanges();
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      
     this.checkForEventsOnDate(this.viewDate);
     this.changeDetectorRef.detectChanges();
     console.log("-------------------------------")
     console.log(this.checkForEventsOnDateList);
     console.log(this.noEvents)
     $('#exampleModalScrollable').modal('show');
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      console.log(this.viewDate + "-------------  ");
    }
  }

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd
  // }: CalendarEventTimesChangedEvent): void {
  //   this.events = this.events.map(iEvent => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd
  //       };
  //     }
  //     return iEvent;
  //   });
  //   this.handleEvent('Dropped or resized', event);
  // }

  // handleEvent(action: string, event: CalendarEvent): void {
  //   this.modalData = { event, action };
  //   this.modal.open(this.modalContent, { size: 'lg' });
  // }

  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors.red,
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true
  //       }
  //     }
  //   ];
  // }

  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.events = this.events.filter(event => event !== eventToDelete);
  // }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    //this.receiverId = Cookie.get('receiverId');
    this.socketid = Cookie.get('socketId');

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getAllEventsOfAUser(this.userInfo.email);

    this.dayViewToken == false

     this.emmissionFunction =setInterval(() => { this.sendRequestForNotification(); }, 60000);

    //setInterval(() => { this.getNotificationFromServer(); }, 10000);

    this.SocketService.getNotification().subscribe((notificationdata)=>
        {
          this.arrayToSendNotification =[];
        console.log("data recieved as notifiation is:",notificationdata)

        this.toCompareEmailOfUserAndNotification(notificationdata,this.userInfo.email);

        console.log("inside the subscriber function",this.arrayToSendNotification)


        if(this.arrayToSendNotification.length >=0)
        {   console.log("inside if",this.arrayToSendNotification)
          this.toPopUpNotification(this.arrayToSendNotification)
        }

        // this.arrayToSendNotification.push(notificationdata);
        console.log("array of notifications in subscribe",this.arrayToSendNotification)

      })


      console.log("array of notifications after subscribe",this.arrayToSendNotification)

      //to get Notification on new event create

      this.SocketService.toGetNotificationFromServerOnCreateOfNewEvent().subscribe((notificationData)=>{
        this.toCheckOwnNotification(notificationData);
      })

      //to get Notification on edit event

      this.SocketService.toGetNotificationFromServerOnEditOfEvent().subscribe((notificationData)=>{
        this.toCheckOwnNotification(notificationData);
      })

      //to get Notification on delete of an event
      this.SocketService.toGetNotificationFromServerOnDeleteOfEvent().subscribe((notificationData)=>{
        this.toCheckOwnNotification(notificationData);
      })
  }

  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser()
      .subscribe((data) => {

        console.log("verifing user ................")
        //console.log("data is : ", data);

        this.disconnectedSocket = false;
        
        let data1 = {authToken:this.authToken,userSocketId:this.socketid}
        this.SocketService.setUser(data1);
        console.log(",,,,,,,,,,,,,,,,")
        console.log(this.authToken)
       // this.getOnlineUserList()

      });
  }

  public getAllEventsOfAUser: any = (email) => {
    console.log("-----------++++++++++++++++++", email)
    this.AppService.getSingleUserEvents(email).subscribe((apiResponse) => {
      //if (apiResponse.status === 200){
      console.log(apiResponse);
      this.eventlist1 = []
      if (apiResponse.data != null) {

        for (let x = 0; x < apiResponse.data.length; x++) {
          let temp = {
            start: new Date(apiResponse.data[x].startTime),
            end: new Date(apiResponse.data[x].endTime),
            title: apiResponse.data[x].eventTitle,
            color: colors.red,
            // actions: this.actions,
            eventId: apiResponse.data[x].eventId
            // allDay: true,
            // resizable: {
            //   beforeStart: true,
            //   afterEnd: true
            // },
            // draggable: true
          }

          this.eventlist1.push(temp);

          //console.log(this.eventlist1)



        }
        // this.events = this.eventlist1;
        // this.changeDetectorRef.detectChanges();
        console.log(this.eventlist1)
      }
      this.events = this.eventlist1;
      this.changeDetectorRef.detectChanges();
      //}
      // else{
      //   console.log("the data for events are not fetched check")
      // }

    })
  }


  public checkForEventsOnDate =(date1)=>{
    console.log("in function")
    let dateInStr = (new Date (date1)).toLocaleDateString();
    console.log(dateInStr)
    this.checkForEventsOnDateList =[]
    for(let x of this.eventlist1)
    {   
      console.log("in for")
      let dateInStr1 = (new Date (x.start)).toLocaleDateString();
      console.log(dateInStr1)
      let dateInStr2 = (new Date (x.end)).toLocaleDateString();
      if((dateInStr1 == dateInStr) || ((new Date (x.start)) < (new Date (date1)) && (new Date (x.end)) > (new Date (date1))) || (dateInStr2 == dateInStr) )
      {
        console.log("in if")
        this.checkForEventsOnDateList.push(x)
       // this.noEvents = true;
        // console.log("in if")
        // console.log(this.noEvents)
      }
      // else{
      //   this.noEvents = false;
      //   console.log("false")

      // }

      // if (dateInStr == dateInStr1)
      // {
      //   this.checkForEventsOnDateList.push(x)
      //  console.log("in if")
      // }
    }

    console.log("checkforeventondatelist")
    console.log(this.checkForEventsOnDateList)

    if(this.checkForEventsOnDateList.length > 0)
    {
       this.noEvents = false;
    }
    else{
       this.noEvents = true;
    }

    console.log(this.noEvents)
    
  }

  public eventSelectedByUser: any = (eventId) => {
    // this.selectedEventToken = true;
    // this.changeDetectorRef.detectChanges();

     //Cookie.delete('eventSelected');

    

    console.log("the eventId is :",eventId)

    // setting that user to chatting true 
    console.log("value of checkForEventsOnDateList", this.checkForEventsOnDateList);  
    this.checkForEventsOnDateList.map((event) => {
      console.log("value of event is :", event)
      if ( event.eventId == eventId) {
        console.log("eventId of selected event is :", event.eventId)
        Cookie.set('eventSelected',event.eventId)
        console.log("selected eventId is :", event.eventId )
        console.log("cookie value inside if",Cookie.get('eventSelected'))

      }
      
    })
   console.log(Cookie.get("eventSelected"))
   console.log(this.selectedEventToken)
  }

  public ViewEvent(): any{
    if (Cookie.get('eventSelected') === undefined || Cookie.get('eventSelected') === '' || Cookie.get('eventSelected') === null) {
      this.toastr.errorToastr('select an event to view');
    }
    else{
      let eventId = Cookie.get('eventSelected');
      this.AppService.getSingleEventInformation(eventId).subscribe(
        data =>{
          
          this.toastr.successToastr('event selected.', 'Success!');
        },
        error => {
          this.toastr.errorToastr('No event found ', 'Oops!')
        }

      )
    }
  }


  public EventDetail(): any{

    if (Cookie.get('eventSelected') === undefined || Cookie.get('eventSelected') === '' || Cookie.get('eventSelected') === null) {
      this.toastr.errorToastr('select an event to view');
    }
    else{
      let eventId = Cookie.get('eventSelected');
      this.AppService.getSingleEventInformation(eventId).subscribe(
        data =>{
          this.EventIdOfSelectedEvent = data.data.eventId,
          this.MobileNumberOfSelectedEvent = data.data.userMobileNumber,
          this.CreatedOnOfSelectedEvent = data.data.createdOn,
          this.CreatedByOfSelectedEvent = data.data.createdBy,
          this.EventTitleOfSelectedEvent = data.data.eventTitle,
          this.EventLocationOfSelectedEvent = data.data.eventLocation,
          this.EventDescriptionOfSelectedEvent = data.data.eventDescription,
          this.UserEmailOfSelectedEvent = data.data.userEmail,
          this.StartTimeOfSelectedEvent = data.data.startTime,
          this.EndTimeOfSelectedEvent = data.data.endTime,
          //this.EventDurationOfSelectedEvent = data.data.EventDurationInHours,

          //console.log("mobile number of selected user is :",this.MobileNumberOfSelectedEvent)
          
          this.toastr.successToastr('event details.', 'Success!');
        },
        error => {
          this.toastr.errorToastr('No event found ', 'Oops!')
        }

      )
    }

  }

  public logout: any = () => {

    this.AppService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          // Cookie.delete('authtoken');

          // Cookie.delete('receiverId');

          // Cookie.delete('receiverName');
          Cookie.deleteAll();
          this.SocketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.toastr.errorToastr(apiResponse.message)

        } // end condition

      }, (err) => {
        this.toastr.errorToastr('some error occured')


      });

  } // end logout

  public goToHome = () =>{
    location.reload();


  } //end goTOHome-month view calendar

 public sendRequestForNotification = () =>{

  let authToken =this.authToken;
  let socketId = this.socketid

  console.log("socketId inside sendRequest",socketId)

  this.SocketService.sendNotificationRequest(authToken,socketId)
  

 }

//  public getNotificationFromServer =() => {
//    console.log("inside get Notification function")

//    this.SocketService.getNotification().subscribe(notificationdata=>
//     {
//       console.log("data recieved as notifiation is:",notificationdata)
//     })
//  }

public toCompareEmailOfUserAndNotification = (notificationArray,emailOfUser) =>
{
  for(let x in notificationArray)
  {
    if(notificationArray[x].userEmail=== emailOfUser)
    {
      this.arrayToSendNotification.push(notificationArray[x]);
    }
  }
  //this.toPopUpNotification(this.arrayToSendNotification)
}
//fun to popup Notification
public toPopUpNotification=(eventNotificationArray) =>{
  if((eventNotificationArray.length)>=0)
  {
    for(let x in eventNotificationArray)
    {
      this.eventTitle = eventNotificationArray[x].eventTitle
      this. startTime = eventNotificationArray[x].startTime
      this. placeOfEvent = eventNotificationArray[x].eventLocation
       this.eventId =eventNotificationArray[x].eventId

    }

    $('#notificationModal').modal('show');
  }
}

public toPushNotificationObjForSnooze  = () =>
{
  let snoozeObj ={
    snoozedEventTitle : this.eventTitle,
    snoozedEventStartTime : this.startTime,
    snoozedEventPlace:this.placeOfEvent,
    snoozedEventId:this.eventId
  }

  console.log("snoozeObj",snoozeObj);

  this.snoozedNotificationList.push(snoozeObj);


  console.log("snoozedNotificationList:",this.snoozedNotificationList)

  this.snoozedNotificationFunction =setInterval(() => { this.sendSnoozedNotification(this.snoozedNotificationList); }, 5000);


}


public sendSnoozedNotification=(snoozedMessageArray)=>
{

  this.CheckForValidation(snoozedMessageArray);
  console.log("snoozedMessageArray is: ",snoozedMessageArray);
  if (snoozedMessageArray.length >0)
  {
    //yaha modal popupkarna hai

    $('#snoozedNotificationModal').modal('show');
  //   this.snoozeTitle = snoozedMessageArray[0].snoozedEventTitle
  //   this.snoozeStartTime =snoozedMessageArray[0].snoozedEventStartTime
  //   this.snoozePlace = snoozedMessageArray[0].snoozedEventPlace
  //   this.snoozeEventId=snoozedMessageArray[0]. snoozedEventId
   }else
  {
    clearInterval(this.snoozedNotificationFunction);
    //clearInterval karna hai
  }


}

public CheckForValidation=(messageArray)=>
{
  for(let x in messageArray)
  {
    let snoozedEventStartTime = new Date(messageArray[x].snoozedEventStartTime)
    let timeNow = new Date()

    console.log("latest time is: ",timeNow);
    console.log("snoozedEventStartTime is: ",snoozedEventStartTime)
    if(snoozedEventStartTime < timeNow)
    {
      console.log("starttime less than timeNow");
      this.snoozedNotificationList.splice(x,1);
    }
  }
}

public dismissFunction=()=>{
  this.snoozedNotificationList =[];
  clearInterval(this.snoozedNotificationFunction);


}

public toCheckOwnNotification =(notificationObjArray)=>{

  // for(let x in notificationObjArray)
  // {
  //   console.log("userInfoOfUser",this.userInfo.userName)
  //  console.log("userInfoOfUserInNitificationObj",notificationObjArray[x].userName)
  //   if(notificationObjArray[x].userName == this.userInfo.userName)
  //  { 
  //    alert(notificationObjArray[x].notifiation_messageOncreate);
  //     this.toastr.successToastr(notificationObjArray[x].notifiation_messageOncreate)
  //   }
  // }

  console.log("userInfoOfUser",this.userInfo.userName)
   console.log("userInfoOfUserInNitificationObj",notificationObjArray.userName)
    if(notificationObjArray.userName == this.userInfo.userName)
   { 
     alert(notificationObjArray.notifiation_message);
      this.toastr.successToastr(notificationObjArray.notifiation_message)
    }

}



 ngOnDestroy(){
  clearInterval(this.emmissionFunction);
 }

}
