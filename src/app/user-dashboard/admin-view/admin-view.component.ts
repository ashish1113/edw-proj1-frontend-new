import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef
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
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

  animations: [collapseAnimation],
  providers: [SocketService]
})
export class AdminViewComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();




  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      title: '',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  activeDayIsOpen: boolean = true;
  modal: any;


  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;


  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastrManager

  ) {
    
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
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

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnInit() {

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    //this.receiverId = Cookie.get('receiverId');

    //this.receiverName = Cookie.get('receiverName');
    console.log(this.receiverId, this.receiverName)

    // if (this.receiverId != null && this.receiverId != undefined && this.receiverId != '') {
    //   this.userSelectedByAdmin(this.receiverId, this.receiverName)
    // }

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getOnlineUserList()

    console.log(this.userList);

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

        this.disconnectedSocket = false;

        this.SocketService.setUser(this.authToken);
        this.getOnlineUserList()

      });
  }

  public getOnlineUserList: any = () => {

    this.SocketService.onlineUserList()
      .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x]};

          this.userList.push(temp);

        }

        console.log(this.userList);

      }); // end online-user-list
  }

  // public userSelectedByAdmin: any = (id, name) => {
    

  //   console.log("setting user as active")

  //   // setting that user to chatting true   
  //   this.userList.map((user) => {
  //     if (user.userId == id) {
  //       user.viewing = true;
  //     }
  //     else {
  //       user.viewing = false;
  //     }
  //   })

  //   Cookie.set('receiverId', id);

  //   Cookie.set('receiverName', name);


  //   this.receiverName = name;

  //   this.receiverId = id;

    

  //   let eventDetails = {
  //     userId: this.userInfo.userId,
  //     senderId: id
  //   }


    

  // } // end userBtnClick function

}
