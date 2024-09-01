import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.isUserLoggedIn().subscribe((isLoggedIn) => {
      this.updateMenu(isLoggedIn);
    });
  }

  updateMenu(isLoggedIn: boolean) {
    this.items = isLoggedIn
      ? [{ label: 'Sign out', command: () => this.onSignOut() }]
      : [{ label: 'Sign in', command: () => this.onSignIn() }];
  }

  onSignIn() {
    this.router.navigateByUrl('/login');
  }

  onSignOut() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
