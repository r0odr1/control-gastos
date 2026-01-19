import { Component, OnInit } from '@angular/core';
import { ExpenseService, Person, Expense } from '../../services/expense.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-tracker.html',
  styleUrls: ['./expense-tracker.css']
})
export class ExpenseTrackerComponent implements OnInit {
  people: Person[] = [];
  activePerson = 0;

  constructor(public expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.people$.subscribe(people => {
      this.people = people;
    });
  }

  get currentPerson(): Person | null {
    return this.people.length > 0 ? this.people[this.activePerson] : null;
  }

  get totals() {
    if(!this.currentPerson) {
      return {
        totalInAccount: 0,
        totalInNequi: 0,
        remaining: 0,
        totalGC: 0,
        totalGN: 0,
        totalIngresa: 0,
      };
    }
    return this.expenseService.calculateTotals(this.currentPerson);
  }

  get grandTotal(): number {
    return this.expenseService.getGrandTotal();
  }

  addPerson(): void {
    this.expenseService.addPerson();
    this.activePerson = this.people.length;
  }

  updatePersonName(index: number, name: string): void {
    const current = this.people[index];
    if (!current) return;

    const person: Person = { ...current, name };
    this.expenseService.updatePerson(index, person);
  }

  updatePersonField(field: keyof Person, value: number): void {
    if (!this.currentPerson) return;

    const person = {
      ...this.currentPerson,
      [field]: value
    };

    this.expenseService.updatePerson(this.activePerson, person);
  }

  addExpense(): void {
    this.expenseService.addExpense(this.activePerson);
  }

  updateExpense(expenseId: number, field: keyof Expense, value: any): void {
    this.expenseService.updateExpense(this.activePerson, expenseId, field, value);
  }

  deleteExpense(expenseId: number): void {
    this.expenseService.deleteExpense(this.activePerson, expenseId);
  }

  trackByExpenseId(index: number, expense: Expense): number {
    return expense.id;
  }
}