
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {OnboardingComponent} from './onboarding/gegevens/onboarding.component';
import { ToevoegenComponent } from './onboarding/toevoegen/toevoegen.component';
import { PersonenComponent } from './onboarding/personen/personen.component';
import { DuurComponent } from './onboarding/duur/duur.component';
import { BedanktComponent } from './onboarding/bedankt/bedankt.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { StorageComponent } from './components/storage/storage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmergencyKitComponent } from './components/emergency-kit/emergency-kit.component';

export const routes: Routes = [
    {
        path: 'onboarding/gegevens',
        component: OnboardingComponent,
    },
    {
        path: 'onboarding/toevoegen',
        component: ToevoegenComponent,
        title: 'toevoegen',
    },
    {
        path: 'onboarding/personen',
        component: PersonenComponent,
        title: 'personen',
    },
    {
        path: 'onboarding/duur',
        component: DuurComponent,
        title: 'duur',
    },
    {
        path: 'onboarding/bedankt',
        component: BedanktComponent,
        title: 'bedankt',
    },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  
    { path: 'client/food_storage', component:StorageComponent}
  {path: 'dashboard', component: DashboardComponent},
  {path: 'emergency-kit', component: EmergencyKitComponent}


import { StorageComponent } from './components/storage/storage.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'client/food_storage', component:StorageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
 
