import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmergencyKitComponent } from './components/emergency-kit/emergency-kit.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    {path: 'dashboard', component: DashboardComponent},
    {path: 'emergency-kit', component: EmergencyKitComponent}
];
