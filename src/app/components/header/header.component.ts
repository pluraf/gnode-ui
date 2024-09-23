import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, DialogModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}
  userInitial: string | null = null;
  showDropdown = false;
  visible: boolean = false;
  position: string = 'top-right';
  displayUsername: string | null = null;

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }

  ngOnInit(): void {
    const username = this.userService.getUsername();
    this.userInitial = username ? username.charAt(0).toUpperCase() : null;
    this.displayUsername = username
      ? username.charAt(0).toUpperCase() + username.slice(1)
      : null;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  onSignOut() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
