import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

  strTime: string = '';

  constructor() {

  }

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    // Saati almak
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Saat, dakika ve saniyeleri iki haneli yapma
    const formattedHours = hours < 10 ? '0' + hours : hours.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

    this.strTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}