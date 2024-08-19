import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CardModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  items: MenuItem[] | undefined;
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}
  ngOnInit() {
    this.updateMenu();
  }
  updateMenu() {
    this.items = this.userService.isLoggedIn()
      ? [{ label: 'Sign out', command: () => this.onSignOut() }]
      : [{ label: 'Sign in', command: () => this.onSignIn() }];
  }

  onSignIn() {
    this.router.navigateByUrl('/login');
  }

  onSignOut() {
    this.userService.logout();
    this.updateMenu();
    this.router.navigateByUrl('/login');
  }
}
