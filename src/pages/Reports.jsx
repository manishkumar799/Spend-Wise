import React, { useState, useEffect } from "react";
import Expense from "./../entities/expense";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Filter, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";
import createPageUrl from "../utils/createPageUrl";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

import ExpenseList from "../components/reports/ExpenseList";
import SpendingChart from "../components/reports/SpendingChart";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "food_dining", label: "Food & Dining" },
  { value: "groceries", label: "Groceries" },
  { value: "transportation", label: "Transportation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "utilities", label: "Utilities" },
  { value: "shopping", label: "Shopping" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "housing", label: "Housing" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

export default function Reports() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    period: "all",
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  const loadExpenses = async () => {
    setIsLoading(true);
    const data = await Expense.getAll("-date", 500);
    setExpenses(data);
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === filters.category
      );
    }

    // Period filter
    const now = new Date();
    if (filters.period === "this_month") {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= startOfMonth(now) && expenseDate <= endOfMonth(now)
        );
      });
    } else if (filters.period === "last_month") {
      const lastMonth = subMonths(now, 1);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= startOfMonth(lastMonth) &&
          expenseDate <= endOfMonth(lastMonth)
        );
      });
    } else if (filters.period === "last_3_months") {
      const threeMonthsAgo = subMonths(now, 3);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= threeMonthsAgo;
      });
    }

    setFilteredExpenses(filtered);
  };

  const exportToCSV = () => {
    const csvData = filteredExpenses.map((expense) => ({
      Date: format(new Date(expense.date), "yyyy-MM-dd"),
      Description: expense.description,
      Amount: expense.amount,
      Category: expense.category,
      "Payment Method": expense.payment_method || "",
      Tags: expense.tags ? expense.tags.join("; ") : "",
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => JSON.stringify(row[header])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const avgAmount =
    filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

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
                  Expense Reports
                </h1>
                <p className="text-slate-600 mt-1">
                  Analyze your spending patterns and financial habits
                </p>
              </div>
            </div>

            <Button
              onClick={exportToCSV}
              className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={filteredExpenses.length === 0}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          <Card className="expense-card shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filters & Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.period}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, period: value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {filteredExpenses.length}
                  </div>
                  <div className="text-sm text-slate-600">Total Expenses</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    ${totalAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    ${avgAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600">Average Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="list">Detailed List</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdown expenses={filteredExpenses} />
              <div className="space-y-6">
                <SpendingChart expenses={filteredExpenses} chartType="bar" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <SpendingChart expenses={filteredExpenses} chartType="line" />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <ExpenseList
              expenses={filteredExpenses}
              title={`Filtered Expenses (${filteredExpenses.length})`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
