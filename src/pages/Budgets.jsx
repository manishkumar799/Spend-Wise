import React, { useState, useEffect } from "react";
import Budget from "./../entities/budget";
import Expense from "./../entities/expense";
import { useNavigate } from "react-router";
import createPageUrl from "./../utils/createPageUrl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Target,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import BudgetForm from "../components/budget/BudgetForm";

const categoryIcons = {
  food_dining: "🍽️",
  transportation: "🚗",
  entertainment: "🎬",
  utilities: "💡",
  shopping: "🛍️",
  healthcare: "🏥",
  education: "📚",
  travel: "✈️",
  subscriptions: "📱",
  groceries: "🛒",
  housing: "🏠",
  insurance: "🛡️",
  other: "📄",
};

export default function BudgetsPage() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  console.log("first");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [budgetData, expenseData] = await Promise.all([
        Budget.getAll("-month"),
        Expense.getAll("-date", 200),
      ]);
      setBudgets(budgetData);
      setExpenses(expenseData);
    } catch (error) {
      console.error("Error loading budget data:", error);
    }
    setIsLoading(false);
  };

  const getCurrentMonthSpending = (category, month) => {
    const monthDate = new Date(month);
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.category === category &&
          expenseDate >= startOfMonth(monthDate) &&
          expenseDate <= endOfMonth(monthDate)
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const handleSubmit = async (budgetData) => {
    setIsFormLoading(true);
    try {
      if (editingBudget) {
        await Budget.update(editingBudget.id, budgetData);
      } else {
        await Budget.create(budgetData);
      }
      setShowForm(false);
      setEditingBudget(null);
      loadData();
    } catch (error) {
      console.error("Error saving budget:", error);
    }
    setIsFormLoading(false);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = async (budgetId) => {
    try {
      await Budget.delete(budgetId);
      loadData();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100)
      return { status: "exceeded", color: "red", icon: AlertTriangle };
    if (percentage >= 80)
      return { status: "warning", color: "yellow", icon: AlertTriangle };
    return { status: "good", color: "green", icon: CheckCircle2 };
  };

  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const currentMonthBudgets = budgets.filter(
    (budget) => budget.month === currentMonth
  );
  const existingCategories = currentMonthBudgets.map((b) => b.category);

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setShowForm(false);
                  setEditingBudget(null);
                }}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {editingBudget ? "Edit Budget" : "Set New Budget"}
                </h1>
                <p className="text-slate-600 mt-1">
                  {editingBudget
                    ? "Update your budget limits"
                    : "Set spending limits for better financial control"}
                </p>
              </div>
            </div>
          </motion.div>

          <BudgetForm
            onSubmit={handleSubmit}
            isLoading={isFormLoading}
            initialData={editingBudget}
            isEditing={!!editingBudget}
            existingCategories={existingCategories}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(createPageUrl("Dashboard"))}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Budget Tracker
                </h1>
                <p className="text-slate-600 mt-1">
                  Set spending limits and track your progress
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Budget
            </Button>
          </div>
        </motion.div>

        {currentMonthBudgets.length > 0 ? (
          <div className="grid gap-6">
            <AnimatePresence>
              {currentMonthBudgets.map((budget, index) => {
                const spent = getCurrentMonthSpending(
                  budget.category,
                  budget.month
                );
                const percentage = Math.min(
                  (spent / budget.monthly_limit) * 100,
                  100
                );
                const status = getBudgetStatus(spent, budget.monthly_limit);

                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="expense-card shadow-lg border-0">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">
                              {categoryIcons[budget.category]}
                            </span>
                            <div>
                              <CardTitle className="text-xl font-bold text-slate-900 capitalize">
                                {budget.category.replace(/_/g, " ")}
                              </CardTitle>
                              <p className="text-slate-500 mt-1">
                                {format(new Date(budget.month), "MMMM yyyy")}{" "}
                                Budget
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-sm ${
                                status.status === "exceeded"
                                  ? "border-red-200 text-red-700"
                                  : status.status === "warning"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-green-200 text-green-700"
                              }`}
                            >
                              <status.icon className="w-4 h-4 mr-1" />
                              {status.status === "exceeded"
                                ? "Over Budget"
                                : status.status === "warning"
                                ? "Near Limit"
                                : "On Track"}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(budget)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Budget?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this budget.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(budget.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">
                            ${spent.toFixed(2)} spent
                          </span>
                          <span className="text-slate-500">
                            of ${budget.monthly_limit.toFixed(2)}
                          </span>
                        </div>

                        <Progress
                          value={percentage}
                          className={`h-4 ${
                            status.status === "exceeded"
                              ? "[&>div]:bg-red-500"
                              : status.status === "warning"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                          }`}
                        />

                        <div className="flex justify-between text-sm">
                          <span
                            className={`font-medium ${
                              status.status === "exceeded"
                                ? "text-red-600"
                                : status.status === "warning"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {percentage.toFixed(1)}% used
                          </span>
                          <span className="text-slate-500">
                            $
                            {Math.max(0, budget.monthly_limit - spent).toFixed(
                              2
                            )}{" "}
                            remaining
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              No budgets set for this month
            </h3>
            <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
              Start taking control of your finances by setting monthly spending
              limits for different categories.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg px-8 py-3"
            >
              <Target className="w-5 h-5" />
              Create Your First Budget
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
