import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  styleUrl: '../app.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @Input() submitting = false;
  @Input() error = '';
  @Output() submitted = new EventEmitter<{ username: string; password: string }>();

  username = '';
  password = '';

  submit(): void {
    this.submitted.emit({ username: this.username, password: this.password });
  }
}
