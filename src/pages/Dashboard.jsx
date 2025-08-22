import React, { useState, useEffect } from "react";
import Expense from "../entities/expense";
import Budget from "../entities/budget";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { motion } from "framer-motion";

import SpendingOverview from "../components/dashboard/SpendingOverview";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import BudgetOverview from "../components/budget/BudgetOverview";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [expenseData, budgetData] = await Promise.all([
        Expense.getAll("-date", 100),
        Budget.getAll("-month"),
      ]);
      setExpenses(expenseData);
      setBudgets(budgetData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  // Calculate statistics
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate >= startOfMonth(currentMonth) &&
      expenseDate <= endOfMonth(currentMonth)
    );
  });

  const lastMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate >= startOfMonth(lastMonth) &&
      expenseDate <= endOfMonth(lastMonth)
    );
  });

  const totalThisMonth = thisMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalLastMonth = lastMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const avgDaily =
    thisMonthExpenses.length > 0 ? totalThisMonth / new Date().getDate() : 0;

  // Calculate current month spending by category for budget tracking
  const currentMonthSpending = {};
  thisMonthExpenses.forEach((expense) => {
    currentMonthSpending[expense.category] =
      (currentMonthSpending[expense.category] || 0) + expense.amount;
  });

  // Get current month budgets
  const currentMonthString = currentMonth.toISOString().slice(0, 7) + "-01";
  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === currentMonthString
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Track your spending and gain insights into your financial habits
          </p>
        </motion.div>

        <div className="space-y-8">
          <SpendingOverview
            totalMonth={totalThisMonth}
            totalLastMonth={totalLastMonth}
            totalExpenses={expenses.length}
            avgDaily={avgDaily}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CategoryBreakdown expenses={expenses} />
            </div>

            <div className="lg:col-span-1">
              <BudgetOverview
                budgets={currentMonthBudgets}
                currentSpending={currentMonthSpending}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentExpenses expenses={expenses} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
