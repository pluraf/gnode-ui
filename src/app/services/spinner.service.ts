import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  spinnerTimeout = 150; // ms
  startTimestamp = 0;
  endTimestamp = 0;
  startCnt = 0;
  spinnerSignal = signal<boolean>(false);

  start() {
    this.startCnt++;
    this.startTimestamp = Date.now();
    setTimeout(() => this.show(), this.spinnerTimeout + 1);
  }

  stop(){
    if (this.startCnt > 0) {
      this.startCnt--;
      if (this.startCnt == 0) {
        this.startTimestamp = 0;
        this.spinnerSignal.set(false);
      }
    }
  }

  private show() {
    if (this.startTimestamp != 0 && Date.now() - this.startTimestamp > this.spinnerTimeout) {
      this.spinnerSignal.set(true);
      setTimeout(() => this.show(), 100);
    }
  }

}
