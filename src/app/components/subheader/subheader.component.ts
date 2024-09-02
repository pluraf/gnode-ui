import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PRIMENG_MODULES } from '../../shared/primeng-modules';

@Component({
  selector: 'app-subheader',
  standalone: true,
  imports: [PRIMENG_MODULES, RouterModule],
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.css',
})
export class SubheaderComponent {
  hideDevices: boolean = true;
  hideStatus: boolean = true;
  hideEdit: boolean = true;
  selectedMenuName: string = 'Connectors';
  constructor(private router: Router) {}

  showDialogToAdd() {
    this.hideDevices = false;
  }

  /*   delete() {
    this.deviceList = this.deviceList.filter(
      (dev) => dev !== this.selectedDevice,
    );
    this.device = { deviceID: '', communication: '', lastseen: '' };
    this.displayDialog = false;
  } */

  editDevice() {
    this.hideEdit = false;
  }
}
