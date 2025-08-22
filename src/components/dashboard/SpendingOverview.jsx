import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function SpendingOverview({
  totalMonth,
  totalLastMonth,
  totalExpenses,
  avgDaily,
}) {
  const monthlyChange =
    totalLastMonth > 0
      ? ((totalMonth - totalLastMonth) / totalLastMonth) * 100
      : 0;
  const isPositiveChange = monthlyChange > 0;

  const stats = [
    {
      title: "This Month",
      value: `$${totalMonth.toFixed(2)}`,
      icon: DollarSign,
      change: monthlyChange,
      color: "blue",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: Calendar,
      color: "purple",
    },
    {
      title: "Daily Average",
      value: `$${avgDaily.toFixed(2)}`,
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Last Month",
      value: `$${totalLastMonth.toFixed(2)}`,
      icon: DollarSign,
      color: "orange",
    },
  ];

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="expense-card shadow-lg border-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-r ${
                  colorMap[stat.color]
                } flex items-center justify-center shadow-md`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-slate-900 mb-2">
                {stat.value}
              </div>
              {stat.change !== undefined && (
                <div
                  className={`flex items-center gap-1 text-sm ${
                    isPositiveChange ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {isPositiveChange ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {Math.abs(monthlyChange).toFixed(1)}% from last month
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
