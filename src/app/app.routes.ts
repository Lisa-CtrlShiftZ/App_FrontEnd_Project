import { Routes } from '@angular/router';
import {OnboardingComponent} from './onboarding/gegevens/onboarding.component';
import { ToevoegenComponent } from './onboarding/toevoegen/toevoegen.component';
import { PersonenComponent } from './onboarding/personen/personen.component';
import { DuurComponent } from './onboarding/duur/duur.component';
import { DieetComponent } from './onboarding/dieet/dieet.component';
import { BedanktComponent } from './onboarding/bedankt/bedankt.component';

export const routes: Routes = [
    {
        path: 'onboarding',
        component: OnboardingComponent,
    },
    {
        path: 'toevoegen',
        component: ToevoegenComponent,
        title: 'toevoegen',
    },
    {
        path: 'personen',
        component: PersonenComponent,
        title: 'personen',
    },
    {
        path: 'duur',
        component: DuurComponent,
        title: 'duur',
    },
    {
        path: 'dieet',
        component: DieetComponent,
        title: 'dieet',
    },
    {
        path: 'bedankt',
        component: BedanktComponent,
        title: 'bedankt',
    },
];


        /* path: 'gegevens',
        loadComponent: () => {
            return import('./onboarding/gegevens/onboarding.component').then((m) => m.OnboardingComponent)
        },
        path: 'toevoegen',
        loadComponent: () => {
            return import('./onboarding/toevoegen/toevoegen.component').then((m) => m.ToevoegenComponent)
        } */