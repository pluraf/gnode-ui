import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  startTimestamp = 0;
  endTimestamp = 0;
  spinnerSignal = signal<boolean>(false);

  start() {
    this.startTimestamp = Date.now();
    setTimeout(() => this.show(), 101);
  }

  stop(){
    this.startTimestamp = 0;
    this.spinnerSignal.set(false);
  }

  private show() {
    if (this.startTimestamp != 0 && Date.now() - this.startTimestamp > 100) {
      this.spinnerSignal.set(true);
      setTimeout(() => this.show(), 101);
    }
  }

}
