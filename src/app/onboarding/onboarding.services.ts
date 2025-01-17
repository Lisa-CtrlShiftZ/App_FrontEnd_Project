import { Injectable } from "@angular/core";

@Injectable ({
    providedIn: 'root',
})
export class OnboardingService {
    private formData: any = {};

    // Save data for each part of the onboarding
    setFormData(step: string, data: any): void {
        this.formData[step] = data;
    }

    // Get collected data
    getFormData(): any {
        return this.formData;
    }

    // Clear form data
    clearFormData(): void {
        this.formData = {};
    }
}