import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../task.service';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, DatePipe],
  styleUrl: '../app.css',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() loading = false;
  @Input() error = '';
  @Input() statusFilter: TaskStatus | '' = '';
  @Output() statusFilterChange = new EventEmitter<TaskStatus | ''>();
  @Output() advance = new EventEmitter<Task>();

  readonly statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  formatStatus(status: TaskStatus): string {
    return status.replace('_', ' ');
  }
}
