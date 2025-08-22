// entities/expense.js
export default class Expense {
  static STORAGE_KEY = "expenses";

  constructor(data) {
    this.amount = data.amount;
    this.description = data.description;
    this.category = data.category;
    this.date = data.date;
    this.payment_method = data.payment_method;
    this.tags = data.tags || [];
    this.id = data.id || Date.now().toString();
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Create a new expense
  static async create(expenseData) {
    try {
      const expenses = this.getAll();
      const newExpense = new Expense(expenseData);
      expenses.push(newExpense);
      this.saveAll(expenses);
      return newExpense;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  }

  // Get all expenses
  static getAll() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading expenses:", error);
      return [];
    }
  }
  
  static get(id) {
    try {
      const expenses = this.getAll();
      const expense = expenses.find((exp) => exp.id == id);

      if (!expense) {
        throw new Error(`Expense with ID ${id} not found`);
      }

      return expense;
    } catch (error) {
      console.error("Error getting expense:", error);
      throw error;
    }
  }
  // Save all expenses
  static saveAll(expenses) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses:", error);
      throw error;
    }
  }

  // Get expenses by date range (optional)
  static getByDateRange(startDate, endDate) {
    const expenses = this.getAll();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
      );
    });
  }

  // Get expenses by category (optional)
  static getByCategory(category) {
    const expenses = this.getAll();
    return expenses.filter((expense) => expense.category === category);
  }

  // Update an expense (optional)
  static async update(id, updateData) {
    try {
      const expenses = this.getAll();
      const index = expenses.findIndex((expense) => expense.id === id);

      if (index === -1) {
        throw new Error("Expense not found");
      }

      expenses[index] = { ...expenses[index], ...updateData };
      this.saveAll(expenses);
      return expenses[index];
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  }

  // Delete an expense (optional)
  static async delete(id) {
    try {
      const expenses = this.getAll();
      const filteredExpenses = expenses.filter((expense) => expense.id !== id);
      this.saveAll(filteredExpenses);
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }

  // Get total amount (optional)
  static getTotal() {
    const expenses = this.getAll();
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }
}
