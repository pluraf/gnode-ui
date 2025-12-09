import { Component } from '@angular/core';
import { DeviceDashboardComponent } from '../dashboards/device-dashboard/device-dashboard.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DeviceDashboardComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.css'
})
export class DashboardContainerComponent {

}
