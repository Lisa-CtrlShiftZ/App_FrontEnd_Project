import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'onboarding',
        loadComponent: () => {
            return import('./onboarding/gegevens/onboarding.component').then((m) => m.OnboardingComponent)
        },
    }
];
