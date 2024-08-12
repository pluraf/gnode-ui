import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { DeviceComponent } from './device/device.component';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DeviceComponent,CardModule,MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UserService]
})
export class AppComponent {
  title = 'gnode-ui';

  items: MenuItem[] | undefined;
constructor(private router: Router, private userService: UserService){}
    ngOnInit() {
     /*    this.items = [
          {
              label: 'Sign in',
              command: () => this.onClickMenu({ label: 'Sign in' })
          },  
        ]*/
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
 /*    onClickMenu(item: MenuItem){
      if(item.label === 'Sign in'){
        this.router.navigateByUrl('/login');
    }
    } */
}
