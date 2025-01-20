import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  http = inject(HttpClient);

  constructor() { }
  postPersonToApi() {
    const url = `http://127.0.0.1:8000/api/family_member`
    
  }
}
