import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router";
import createPageUrl from "./../../utils/createPageUrl";
import { Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function RecentExpenses({ expenses, isLoading }) {
  const recentExpenses = expenses.slice(0, 6);

  return (
    <Card className="expense-card shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900">
          Recent Expenses
        </CardTitle>
        <Link to={createPageUrl("AddExpense")}>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentExpenses.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {recentExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {categoryIcons[expense.category] || "📄"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {expense.description}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {expense.category
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                        • {format(new Date(expense.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-lg">
                      -${expense.amount.toFixed(2)}
                    </div>
                    {expense.payment_method && (
                      <div className="text-xs text-slate-500 capitalize">
                        {expense.payment_method.replace(/_/g, " ")}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to={createPageUrl("Expenses")}>
              <Button variant="outline" className="w-full mt-4 gap-2">
                View All Expenses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No expenses yet
            </h3>
            <p className="text-slate-500 mb-6">
              Start tracking your spending to see insights here
            </p>
            <Link to={createPageUrl("AddExpense")}>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="w-4 h-4" />
                Add Your First Expense
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
