import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {OnboardingComponent} from './onboarding/gegevens/onboarding.component';
import { ToevoegenComponent } from './onboarding/toevoegen/toevoegen.component';
import { PersonenComponent } from './onboarding/personen/personen.component';
import { DuurComponent } from './onboarding/duur/duur.component';
import { BedanktComponent } from './onboarding/bedankt/bedankt.component';
import { OverzichtComponent } from './onboarding/overzicht/overzicht.component';

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
    {
        path: 'onboarding/overzicht',
        component: OverzichtComponent,
        title: 'overzicht',
    },
    

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}