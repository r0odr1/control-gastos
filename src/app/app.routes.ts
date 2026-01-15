import { Routes } from '@angular/router';
import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker';

export const routes: Routes = [
  {
    path: 'expenses',
    loadComponent: () =>
    import('./components/expense-tracker/expense-tracker')
      .then(m => m.ExpenseTrackerComponent)
  }
];
