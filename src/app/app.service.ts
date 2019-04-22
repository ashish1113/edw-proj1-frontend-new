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
    const params = new HttpParams()
      .set('email', eventData.email)
      .set('eventTitle',eventData.eventTitle)
      .set('mobileNumber', eventData.mobileNumber)
      .set('startDate', eventData.startDate)
      .set('endDate', eventData.endDate)
      .set('eventLocation', eventData.eventLocation)
      .set('eventDescription', eventData.eventDescription)
      .set('startHours', eventData.startHours)
      .set('startMins', eventData.startMins)
      .set('endHours', eventData.endHours)
      .set('endMins', eventData.endMins)
      .set('authToken', eventData.authToken)
    return this.http.post(`${this.url}/api/v1/users/create/event`, params);
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
