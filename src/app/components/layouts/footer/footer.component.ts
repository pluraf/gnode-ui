import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng-modules';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [PRIMENG_MODULES],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
