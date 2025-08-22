import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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

const categoryColors = {
  food_dining: "bg-orange-100 text-orange-800",
  transportation: "bg-blue-100 text-blue-800",
  entertainment: "bg-purple-100 text-purple-800",
  utilities: "bg-yellow-100 text-yellow-800",
  shopping: "bg-pink-100 text-pink-800",
  healthcare: "bg-red-100 text-red-800",
  education: "bg-green-100 text-green-800",
  travel: "bg-indigo-100 text-indigo-800",
  subscriptions: "bg-cyan-100 text-cyan-800",
  groceries: "bg-lime-100 text-lime-800",
  housing: "bg-slate-100 text-slate-800",
  insurance: "bg-emerald-100 text-emerald-800",
  other: "bg-gray-100 text-gray-800",
};

export default function ExpenseList({ expenses, title = "All Expenses" }) {
  return (
    <Card className="expense-card shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-slate-500">
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`text-xs ${
                          categoryColors[expense.category]
                        }`}
                      >
                        {expense.category
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </span>
                      {expense.payment_method && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {expense.payment_method.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>
                    {expense.tags && expense.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {expense.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {expense.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{expense.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-lg">
                    -${expense.amount.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
