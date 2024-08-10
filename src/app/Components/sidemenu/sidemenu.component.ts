import { Component } from '@angular/core';
import { Sidemenu } from '../../device/device';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {
  sidemenulist: Sidemenu[] = [
    { name: 'Registry Details' },
    { name: 'Devices' },
  ];
}
