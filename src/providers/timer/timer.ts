import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import 'rxjs/add/operator/map'
import * as $ from 'jquery'
import * as moment from 'moment'

/*
  Generated class for the TimerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimerProvider {
  dailyPunchUrl;
  weeklyUrl;

  constructor(public http: Http) {
    console.log('Hello TimerProvider Provider');
    this.dailyPunchUrl = "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getDailyPunchRecords";
    this.weeklyUrl = "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getAllLeaveDays";
  }

  getTimings(employeeId, date) {
    var month = date.getMonth() + 1;
    var request = {
      SelectedDate :  month + "-" + date.getDate() + "-" + date.getFullYear(),
      empid : employeeId
    };
     return this.http.post(this.dailyPunchUrl, request).map(value => value.json());
  }

  getWeeklyData(employeeId, date) {
    var month = date.getMonth() + 1;
    var request = {
      Currdate :  month + "-" + date.getDate() + "-" + date.getFullYear(),
      empid : employeeId
    };
    return this.http.post(this.weeklyUrl, request).map(value => value.json());
  }


}
