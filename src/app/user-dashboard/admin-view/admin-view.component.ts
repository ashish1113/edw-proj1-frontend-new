import {
  Component,
  
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef,
  OnDestroy
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
}
import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber'

import { ChangeDetectorRef } from '@angular/core'

import * as bootstrap from 'bootstrap';
//import * as $ from "jquery";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,

  animations: [collapseAnimation],
  providers: [SocketService,AppService]
})
export class AdminViewComponent implements OnInit,OnDestroy {
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
  //  [
  //   {
  //     start: startOfDay(new Date()),
  //     title: '',
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
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

  // ];

  //activeDayIsOpen: boolean = true;//iske bare me dekhna hai
  activeDayIsOpen: boolean

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

  // variable to store event details

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
    private modal: NgbModal

  ) { }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.dayViewToken = true;
    this.view = CalendarView.Day;
    console.log(this.eventlist1);
    
    //public Cycle = setInterval(this.timedFunction, 5);
    //setInterval(this.timedFunction, 5);
    
    
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
        //this.dayViewToken =true;
        //this.activeDayIsOpen = false;
      } else {

        this.activeDayIsOpen = true;
      }
      console.log(this.viewDate + "-------------  ");

      console.log(this.dayViewToken);
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
    this.userSelectedUsername = Cookie.get('userSelectedUsername');
    this.socketid = Cookie.get('socketId');
    this.userSelectedemail = Cookie.get('userSelectedemail');
    this.userSelectedfullName = Cookie.get('userSelectedfullName');
    //console.log(this.receiverId, this.receiverName)

    // if (this.receiverId != null && this.receiverId != undefined && this.receiverId != '') {
    //   this.userSelectedByAdmin(this.receiverId, this.receiverName)
    //console.log(";;;;;;;" screen.width);
    // }

     this.checkStatus();

    // this.verifyUserConfirmation();

     //this.getOnlineUserList();

   this.getAllEventsOfAUser(this.userSelectedUsername);

    console.log(this.userList);
    console.log("-------------------------------------")
    console.log(this.dayViewToken);
    

    console.log("cookie value inside ngOnint",Cookie.get('eventSelected'))
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

        let data1 = { authToken: this.authToken, userSocketId: this.socketid }
        this.SocketService.setUser(data1);
        console.log(",,,,,,,,,,,,,,,,")
        console.log(this.authToken)
        this.getOnlineUserList()

      });
  }

  public getOnlineUserList: any = () => {
    console.log('##########################################')

    this.SocketService.onlineUserList()
      .subscribe((userList) => {

        this.userList = [];

        for (let x of userList) {
          console.log("online user in list: ",x)

          let temp = x;

          this.userList.push(temp);

        }

        console.log(this.userList);

      }); // end online-user-list
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
  public eventSelectedByAdmin: any = (eventId) => {
    // this.selectedEventToken = true;
    // this.changeDetectorRef.detectChanges();

     Cookie.delete('eventSelected');

    

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
  } // end userBtnClick function
  

 // logout function

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

  //go-to -calendar
  public goToDashboard = () =>{
    // Cookie.delete('userSelectedUsername');
    // Cookie.delete('userSelectedemail');
    // Cookie.delete('userSelectedfullName');
    // this.changeDetectorRef.detectChanges();
    // this.viewDate = new Date();
    // this.dayViewToken =false;
    // this.view = CalendarView.Month;
    // this.viewToken = true;
    // this.changeDetectorRef.detectChanges();
    location.reload();
  }
  public goToHome = () =>{
    Cookie.delete('userSelectedUsername');
    Cookie.delete('userSelectedemail');
    Cookie.delete('userSelectedfullName');
    this.router.navigate(['/admin-dashboard']);


  }
  
  public goToEdit = () =>{
    if (Cookie.get('eventSelected') === undefined || Cookie.get('eventSelected') === '' || Cookie.get('eventSelected') === null) {
      this.toastr.errorToastr('select an event to edit');
      this.router.navigate(['/admin-view'])
    }
   

    //this.router.navigate(['/edit']);
    //this.changeDetectorRef.detectChanges();


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
          this.EventDescriptionOfSelectedEvent = data.data.EventDurationInHours,
          
          this.toastr.successToastr('event details.', 'Success!');
        },
        error => {
          this.toastr.errorToastr('No event found ', 'Oops!')
        }

      )
    }

  }



  public DeleteEvent(): any {
    if (Cookie.get('eventSelected') === undefined || Cookie.get('eventSelected') === '' || Cookie.get('eventSelected') === null) {
      this.toastr.errorToastr('select an event to delete');
    }
    else {
      let eventId = Cookie.get('eventSelected');
      console.log("eventId to be deleted,,,,,,,,,,,,,,", eventId);
      this.AppService.DeleteEvent(eventId).subscribe(
        data => {
          this.toastr.successToastr('event deleted.', 'Success!');
          Cookie.delete('eventSelected');
          this.dayViewToken = false
          //this.changeDetectorRef.detectChanges();
          location.reload();


          // setTimeout(()=>{
          //   this.router.navigate(['/admin-view']);
          // },500)
        },
        error => {
          this.toastr.errorToastr('This is error toast.', 'Oops!')
        }


      )
    }

  }
  

  public checkForEventsOnDate =(date1)=>{
    console.log("in function")
    let dateInStr = (new Date (date1)).toLocaleDateString();
    console.log(dateInStr)
    this.checkForEventsOnDateList = []

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
   
  //  public timedFunction = () =>
  //  {
  //   this.screenWidth = screen.width; 
  //   if(this.dayViewToken ==true && this.screenWidth<=400)
  // { this.tokenForDayView = true;
  //   this.view = CalendarView.Day;
  //   this.changeDetectorRef.detectChanges();
  // }else{this.view = CalendarView.Week;
  //   this.tokenForDayView = false;
  //   this.changeDetectorRef.detectChanges();
  // }
  //   }

  ngOnDestroy(){

    //clearInterval(.Cycle);

    // Cookie.delete('userSelectedUsername');
    // Cookie.delete('userSelectedemail');
    // Cookie.delete('userSelectedfullName');

  }


}
