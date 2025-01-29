import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-adjuster',
  templateUrl: './supply-adjuster.component.html',
  styleUrls: ['./supply-adjuster.component.css']
})
export class SupplyAdjusterComponent {
  @Input() itemName: string = '';
  @Input() infoText: string = '';
  @Input() quantity: number = 0;

  @Input() showTooltip: boolean = true;

  @Output() quantityChange = new EventEmitter<number>();

  increase() {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrease() {
    if (this.quantity > 0) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}

