import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Expense {
  id: number;
  description: string;
  gc: number;
  gn: number;
  ingresa: number;
}

export interface Person {
  id: number;
  name: string;
  monthlyIncome: number;
  nequiIncome: number;
  totalInAccount: number;
  totalInNequi: number;
  expenses: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private peopleSubject = new BehaviorSubject<Person[]>([
    {
      id: 1,
      name: 'Rodri',
      monthlyIncome: 3027823,
      nequiIncome: 0,
      totalInAccount: 654605,
      totalInNequi: 0,
      expenses: []
    }
  ]);

  people$ = this.peopleSubject.asObservable();

  getPeople(): Person[] {
    return this.peopleSubject.value;
  }

  addPerson(): void {
    const currentPeople = this.getPeople();
    const newPerson: Person = {
      id: currentPeople.length + 1,
      name: `Persona ${currentPeople.length + 1}`,
      monthlyIncome: 0,
      nequiIncome: 0,
      totalInAccount: 0,
      totalInNequi: 0,
      expenses: []
    };
    this.peopleSubject.next([...currentPeople, newPerson]);
  }

  updatePerson(index: number, person: Person): void {
    const people = this.getPeople();
    people[index] = person;
    this.peopleSubject.next([...people]);
  }

  addExpense(personIndex: number): void {
    const people = this.getPeople();
    const newExpense: Expense = {
      id: Date.now(),
      description: '',
      gc: 0,
      gn: 0,
      ingresa: 0
    };
    people[personIndex].expenses.push(newExpense);
    this.peopleSubject.next([...people]);
  }

  updateExpense(personIndex: number, expenseId: number, field: keyof Expense, value: any): void {
    const people = this.getPeople();
    const expense = people[personIndex].expenses.find(e => e.id === expenseId);
    if (expense) {
      (expense as any)[field] = value;
      this.peopleSubject.next([...people]);
    }
  }

  deleteExpense(personIndex: number, expenseId: number): void {
    const people = this.getPeople();
    people[personIndex].expenses = people[personIndex].expenses.filter(e => e.id !== expenseId);
    this.peopleSubject.next([...people]);
  }

  calculateTotals(person: Person) {
    const totalGC = person.expenses.reduce((sum, e) => sum + e.gc, 0);
    const totalGN = person.expenses.reduce((sum, e) => sum + e.gn, 0);
    const totalIngresa = person.expenses.reduce((sum, e) => sum + e.ingresa, 0);

    const totalInAccount = person.monthlyIncome + totalIngresa;
    const totalInNequi = person.nequiIncome;
    const totalAmount = totalInAccount + totalInNequi;
    const remaining = totalAmount - totalGC - totalGN;

    return { totalGC, totalGN, totalIngresa, totalInAccount, totalInNequi, totalAmount, remaining };
  }

  getGrandTotal(): number {
    return this.getPeople().reduce((sum, person) => {
      const { remaining } = this.calculateTotals(person);
      return sum + remaining;
    }, 0);
  }
}