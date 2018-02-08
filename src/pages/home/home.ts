import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TimerProvider} from "../../providers/timer/timer";
import * as moment from "moment";
import * as $ from "jquery";
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   employeeId;
   totalMinutes;
   swipeList = [];
   finalTimeToday;
   date;

  constructor(public navCtrl: NavController,
              private timerProvider: TimerProvider,
              private datePicker: DatePicker) {
    var currDate = new Date();
    var month = currDate.getMonth() + 1;
           this.date =  month + "-" + currDate.getDate() + "-" + currDate.getFullYear();
           this.date = currDate.toISOString();
  }

  ionViewWillEnter() {

    this.timerProvider.getTimings(this.employeeId, new Date()).subscribe(value => {
       this.totalMinutes = this.calculateTimeLogAndSetTableData(value, this.swipeList);
       this.formatFinalTime(this.totalMinutes);
    });
  }

  calculateTimeLogAndSetTableData(response, swipeList) {
    var result = JSON.parse(response.d);
    var lastIn = null;
    var totalMinutes = 0;
    var resultList = result.SwipeRecord;

    $.each(resultList, function () {
      var todayDate = new Date();
      var monthNumber = todayDate.getMonth() + 1;

      var armyTime = moment(this.swipeTime, ["h:mm A"]).format("HH:mm");
      var logDate = monthNumber + "-" + todayDate.getDate() + "-" + todayDate.getFullYear() + " " + armyTime + ":00";

      if (lastIn === null && this.swipeInOut === "In") {
        lastIn = logDate;
      }

      if (this.swipeInOut === "Out" && lastIn !== null) {
        var output = moment.utc(moment(logDate, "MM-DD-YYYY HH:mm:ss").diff(moment(lastIn, "MM-DD-YYYY HH:mm:ss"))).format("HH:mm");
        var outputArray = output.split(":");
        totalMinutes += (parseInt(outputArray[0]) * 60) + parseInt(outputArray[1]);
        lastIn = null;
      }

      var swipe = {swipeInOut: this.swipeInOut, swipeTime: armyTime};
      swipeList.push(swipe);
    });

    if (lastIn !== null) {
      var lastLog = new Date();
      var lastInDate = (moment(lastIn, "MM-DD-YYYY HH:mm:ss")).toDate();

      if (((new Date).getDate() - lastInDate.getDate()) !== 0) {
        lastLog.setHours(0, 0, 0);
      }

      var output = moment.utc(moment(lastLog).diff(moment(lastIn, "MM-DD-YYYY HH:mm:ss"))).format("HH:mm");
      var outputArray = output.split(":");
      totalMinutes += (parseInt(outputArray[0]) * 60) + parseInt(outputArray[1]);
      lastIn = null;

    }

    return totalMinutes;
  }


  formatFinalTime(totalMinutes) {
        this.finalTimeToday = Math.floor(totalMinutes / 60) + " hours " + totalMinutes % 60 + " minutes ";
  }

  submitForm() {
    this.timerProvider.getTimings(this.employeeId, this.parseISOString(this.date)).subscribe(value => {
      this.swipeList = [];
      this.totalMinutes = this.calculateTimeLogAndSetTableData(value, this.swipeList);
      this.formatFinalTime(this.totalMinutes);
    });
  }

  parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }




}
