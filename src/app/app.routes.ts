import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { DeviceComponent } from './device/device.component';

export const routes: Routes = [
    
    {
        path: '', redirectTo: 'app', pathMatch: 'full'
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'device', component: DeviceComponent,
        canActivate: [authGuard]
    },
    {
        path: 'register', component: RegisterComponent
    }
];
