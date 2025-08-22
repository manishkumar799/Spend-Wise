import React, { useState, useEffect } from "react";
import Expense from "../entities/expense";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { motion } from "framer-motion";

import SpendingOverview from "../components/dashboard/SpendingOverview";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import RecentExpenses from "../components/dashboard/RecentExpenses";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    const data = await Expense.getAll("-date", 100);
    setExpenses(data);
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
              <RecentExpenses expenses={expenses} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
