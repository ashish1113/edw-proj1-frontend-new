import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userName: any ;
  public password: any;
  constructor(public router:Router, public appService:AppService, public toastr: ToastrManager) { }

  ngOnInit() {
  }

  public goToSignUp: any = () =>{
    this.router.navigate(['/signup']);
  }

  public signinFunction: any = () =>{

    if (!this.userName){
      this.toastr.warningToastr('enter userName/email')
    }
    else if (!this.password){
      this.toastr.warningToastr('enter password')
    }
    else {
      let data = { 
        userName: this.userName,
        password:this.password,
      }
      console.log(data);

      this.appService.signinFunction(data).subscribe((apiResponse) =>{

        if (apiResponse.status === 200){
          console.log(apiResponse);
          console.log("......................................")
          

          Cookie.set('authtoken', apiResponse.data.authToken);

          Cookie.set('typeOfUser', apiResponse.data.userDetails.typeOfUser);

          Cookie.set('userId', apiResponse.data.userDetails.userId);

          Cookie.set('userName', apiResponse.data.userDetails.userName);

          Cookie.set('fullName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
          //this.router.navigate(['/user-view']);

          if(this.userName.substr(this.userName.length - 5) === "admin"){
            console.log("you are admin"+ "userName :",this.userName);
            this.router.navigate(['/admin-dashboard']);
          }
          else{
            console.log("you are normal user"+ "userName :",this.userName);
            this.router.navigate(['/user-view']);
          }
        }
        else {
          this.toastr.errorToastr(apiResponse.message)
        }
      },(err) => {
        this.toastr.errorToastr('some error occured')
      });
    }
   

  }

}
