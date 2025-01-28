
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {OnboardingComponent} from './onboarding/gegevens/onboarding.component';
import { ToevoegenComponent } from './onboarding/toevoegen/toevoegen.component';
import { PersonenComponent } from './onboarding/personen/personen.component';
import { DuurComponent } from './onboarding/duur/duur.component';
import { BedanktComponent } from './onboarding/bedankt/bedankt.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

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
  { path: 'login', component: LoginComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
 
