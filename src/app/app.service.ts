import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://192.168.1.67:3000';

  constructor( public http: HttpClient) { }

  public getUserInfoFromLocalstorage = () =>{
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage= (data) =>{
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('country', data.country);
    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  }

  public createEvent(eventData): Observable<any> {
    console.log("event data for create event in app service: ",eventData);
    const params = new HttpParams()
      .set('email', eventData.Email)
      .set('eventTitle',eventData.Title)
      .set('userMobileNumber', eventData.MobileNumber)
      .set('startDate', eventData.StartDate)
      .set('endDate', eventData.EndDate)
      .set('eventLocation', eventData.Location)
      .set('eventDescription', eventData.Description)
      .set('startHours', eventData.StartHours)
      .set('startMins', eventData.StartMins)
      .set('endHours', eventData.EndHours)
      .set('endMins', eventData.EndMins)
    .set('authToken', eventData.authToken)
    return this.http.post(`${this.url}/api/v1/users/create/event`, params);
  }
  
  public DeleteEvent(eventId): Observable<any> {

    console.log("eventId to be deleted",eventId);

    const params = new HttpParams()
      .set('eventId',eventId)
      //.set('authToken',authToken)
    return this.http.post(`${this.url}/api/v1/users/${eventId}/delete?authToken=${Cookie.get('authtoken')}`,params);
  }

  public EditEvent(currentEventId,eventData): Observable<any>{
    console.log("eventId of event to be edited : ", currentEventId);

    console.log("event data in edit event  :",eventData)

      // let startYear = eventData.startDate.getUTCFullYear();
      // let startMonth = eventData.startDate.getUTCMonth();
      // let startDate1 = eventData.startDate.getUTCDate();

      // let StartTime = new Date(startYear,startMonth+1,startDate1,eventData.StartHours,eventData.StartMins);



      // let endYear = eventData.endDate.getUTCFullYear();
      // let endMonth = eventData.endDate.getUTCMonth();
      // let endDate1 = eventData.endDate.getUTCDate();




    const params = new HttpParams()
      .set('userEmail', eventData.Email)
      .set('eventTitle',eventData.Title)
      .set('userMobileNumber', eventData.MobileNumber)
      //.set('startTime',StartTime.toUTCString())
      //.set('endTime', eventData.EndDate)
      .set('eventLocation', eventData.Location)
      .set('eventDescription', eventData.Description)
      //.set('startHours', eventData.StartHours)
      //.set('startMins', eventData.StartMins)
      // .set('endHours', eventData.EndHours)
      // .set('endMins', eventData.EndMins)
    //.set('authToken', eventData.authToken)
    return this.http.put(`${this.url}/api/v1/users/${currentEventId}/edit?authToken=${Cookie.get('authtoken')}`,params);
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('password', data.password);
    return this.http.post(`${this.url}/api/v1/users/login`, params);

  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public getSingleUserEvents (email) :Observable<any>{
    return this.http.get(`${this.url}/api/v1/users/${email}/details/allEvents?authToken=${Cookie.get('authtoken')}`)
    
    
  }
  public getResetLink (email) :Observable<any>{
    console.log("came inside resetlink fn: ",email);
    const params = new HttpParams()
    .set('email', email)
    return this.http.post(`${this.url}/api/v1/users/forgot/password`,params)

  }

  public setNewPassword (password,token):Observable<any>
  {
    const params = new HttpParams()
    .set('newPassword', password)
    return this.http.post(`${this.url}/api/v1/users/reset/${token}`,params)
  }

  public getSingleEventInformation (currentEventId) : Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/read/${currentEventId}/Details?authToken=${Cookie.get('authtoken')}`)
  }



  
  

  private  handleError(err: HttpErrorResponse){

    let errorMessage = '';

    if (err.error instanceof Error) { 
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else{
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  }
}
