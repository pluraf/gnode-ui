import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceDashboardComponent } from '../dashboards/device-dashboard/device-dashboard.component';
import { DeviceHistoryComponent } from '../dashboards/device-history/device-history.component';


@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DeviceDashboardComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.css'
})
export class DashboardContainerComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Optional: Load default on init
    this.loadComponent('a');
  }

  loadComponent(type: string) {
    this.container.clear();

    if (this.router.url == "/dashboard/devices") {
      const componentRef = this.container.createComponent(DeviceDashboardComponent);
    }
    else if (this.router.url.startsWith("/dashboard/device/")) {
      const componentRef = this.container.createComponent(DeviceHistoryComponent);
      componentRef.instance.deviceId = this.router.url.split("/").at(-1);
    }
    // componentRef?.instance.someOutput.subscribe((event) => console.log(event));
  }

}
