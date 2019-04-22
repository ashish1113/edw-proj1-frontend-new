import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef,
  OnDestroy
} from '@angular/core';

import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers: [SocketService]
})
export class AdminDashboardComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  //public receiverId: any;
  //public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  socketid: any;
  //public dayViewToken = false;
  userSelectedUsername: string;
  userSelectedemail: string;
  userSelectedfullName: string;
  //screenWidth: any;
  //viewToken: boolean;
  //checkForEventsOnDateList: any = [];
  //noEvents: boolean = true;
  //tokenForDayView: boolean;

  constructor(
    public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastrManager,
  ) { }

  ngOnInit() {
    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.userSelectedUsername = Cookie.get('userSelectedUsername');
    this.socketid = Cookie.get('socketId');
    this.userSelectedemail = Cookie.get('userSelectedemail');
    this.userSelectedfullName = Cookie.get('userSelectedfullName');

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getOnlineUserList();
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

        console.log("verifing user ......aaaaaaaaaaaaaaaaa..........")
        console.log("verifyuserconfirmation verify user data via observer: ", data);

        this.disconnectedSocket = false;

        let data1 = { authToken: this.authToken, userSocketId: this.socketid }
        this.SocketService.setUser(data1);//Should comment out
        console.log(",,,,,,,,,,,,,,,,")
        console.log(this.authToken)
        //this.getOnlineUserList()

      });
  }

  public getOnlineUserList: any = () => {
    console.log('##########################################')

    this.SocketService.onlineUserList()
      .subscribe((userList) => {

        this.userList = [];

        for (let x of userList) {
          console.log(x)

          let temp = x

          this.userList.push(temp);

        }

        console.log(this.userList);

      }); // end online-user-list
  }

  public userSelectedByAdmin: any = (userName, email, fullName) => {


    console.log("setting user as active")

    // setting that user to chatting true   
    this.userList.map((user) => {
      if (user.userName == userName) {
        user.viewing = true;
      }
      else {
        user.viewing = false;
      }
    })

    Cookie.set('userSelectedUsername', userName);

    Cookie.set('userSelectedemail', email);
    Cookie.set('userSelectedfullName', fullName)


    this.userSelectedUsername = userName;

    this.userSelectedemail = email;

    this.userSelectedfullName = fullName;

    //this.eventlist1=[]
    //this.getAllEventsOfAUser(this.userSelectedUsername);

    // let eventDetails = {
    //   userId: this.userInfo.userId,
    //   senderId: id
    // }
    console.log("---------------", this.userSelectedUsername);

    this.router.navigate(['/admin-view']);

    //console.log("---------------",this.userSelectedUsername);

  } // end userBtnClick function

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

}
