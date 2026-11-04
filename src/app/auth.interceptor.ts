import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TaskService } from './task.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(TaskService).getToken();
  if (!token || !request.url.includes('/api/tasks')) return next(request);
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
