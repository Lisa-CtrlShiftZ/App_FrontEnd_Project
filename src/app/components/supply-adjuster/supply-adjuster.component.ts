import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

 
@Component({
  selector: 'app-item-adjuster',
  templateUrl: './supply-adjuster.component.html',
  styleUrls: ['./supply-adjuster.component.css'],
})
export class SupplyAdjusterComponent {
  @Input() itemName: string = '';
  @Input() infoText: string = '';
  @Input() quantity: number = 0;

  @Input() showTooltip: boolean = true;

  @Output() quantityChange = new EventEmitter<number>();

  stock = signal<any[]>([]);
  httpClient = inject(HttpClient);
  url = 'http://127.0.0.1:8000/api';
  user = JSON.parse(localStorage.getItem('user') || 'null ');
  userId = this.user.id;

  constructor(private http: HttpClient ) {};

  increase() {
    this.quantity++;
    
  }

  decrease() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
 }

