import { Component } from '@angular/core';

@Component({
  selector: 'app-storage',
  imports: [],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})

export class StorageComponent {
  addBox(): void {
    const container = document.getElementById('storage_container') as HTMLDivElement;
    console.log("this gets called")
    if (container) {
      const storage_element = document.createElement('div');
      storage_element.className = 'storage_element';
      storage_element.innerText = `placeholder text`;
      container.appendChild(storage_element);
    } else {
      console.error('Target div not found!');
    }
  }
}