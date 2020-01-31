import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  @Input() message: string;
  @Input() message1: string;
  @Input() message2: string;
  @Output() closeAlert = new EventEmitter<void>();

  onClose() {
    this.closeAlert.emit();
  }

}
