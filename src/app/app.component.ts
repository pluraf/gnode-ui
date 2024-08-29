import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HeaderComponent } from './components/layouts/header/header.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { PRIMENG_MODULES } from './shared/primeng-modules';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PRIMENG_MODULES],
  providers: [Router],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'gnode-ui';
  sidemenulist = ['Devices', 'Status'];
  formGroup!: FormGroup<{ selectedMenu: FormControl<[] | null> }>;
  router: Router = inject(Router);

  constructor() {
    this.formGroup = new FormGroup({
      selectedMenu: new FormControl<[] | null>(null),
    });
  }

}
