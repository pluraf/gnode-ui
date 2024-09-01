import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MenuModule, SplitterModule, DividerModule, SidebarModule],
  providers: [Router],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'gnode-ui';
  router: Router = inject(Router);
  items : MenuItem[] = [
    {label: 'Connectors', routerLink: '/connectors'},
    {label: 'Pipelines', routerLink: '/pipelines'},
    {label: 'Users', routerLink: '/users'},
  ];

  constructor() {
  }

}
