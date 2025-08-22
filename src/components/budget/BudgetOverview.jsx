import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import createPageUrl from "./../../utils/createPageUrl";
import { Button } from "@/components/ui/button";

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

export default function BudgetOverview({ budgets, currentSpending }) {
  if (!budgets.length) {
    return (
      <Card className="expense-card shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No budgets set
            </h3>
            <p className="text-slate-500 mb-6">
              Create budgets to track your spending limits
            </p>
            <Link to={createPageUrl("Budgets")}>
              <Button className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Target className="w-4 h-4" />
                Set Your First Budget
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100)
      return { status: "exceeded", color: "red", icon: AlertTriangle };
    if (percentage >= 80)
      return { status: "warning", color: "yellow", icon: AlertTriangle };
    return { status: "good", color: "green", icon: CheckCircle2 };
  };

  return (
    <Card className="expense-card shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Budget Overview
        </CardTitle>
        <Link to={createPageUrl("Budgets")}>
          <Button variant="outline" size="sm">
            Manage Budgets
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget, index) => {
            const spent = currentSpending[budget.category] || 0;
            const percentage = Math.min(
              (spent / budget.monthly_limit) * 100,
              100
            );
            const status = getBudgetStatus(spent, budget.monthly_limit);

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {categoryIcons[budget.category]}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-900 capitalize">
                        {budget.category.replace(/_/g, " ")}
                      </h4>
                      <p className="text-sm text-slate-500">
                        ${spent.toFixed(2)} of $
                        {budget.monthly_limit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        status.status === "exceeded"
                          ? "border-red-200 text-red-700"
                          : status.status === "warning"
                          ? "border-yellow-200 text-yellow-700"
                          : "border-green-200 text-green-700"
                      }`}
                    >
                      <status.icon className="w-3 h-3 mr-1" />
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                <Progress
                  value={percentage}
                  className={`h-3 ${
                    status.status === "exceeded"
                      ? "[&>div]:bg-red-500"
                      : status.status === "warning"
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-green-500"
                  }`}
                />

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Remaining: $
                    {Math.max(0, budget.monthly_limit - spent).toFixed(2)}
                  </span>
                  <span
                    className={`font-medium ${
                      status.status === "exceeded"
                        ? "text-red-600"
                        : status.status === "warning"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {status.status === "exceeded"
                      ? "Over budget"
                      : status.status === "warning"
                      ? "Approaching limit"
                      : "On track"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
