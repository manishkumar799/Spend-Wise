import React, { useState, useEffect } from "react";
import Expense from "./../entities/expense";
import { useNavigate } from "react-router";
import createPageUrl from "../utils/createPageUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";

import ExpensesTable from "./../components/expenses/ExpenseTable";

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

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    let filtered = expenses.filter((expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === categoryFilter
      );
    }
    setFilteredExpenses(filtered);
  }, [searchTerm, categoryFilter, expenses]);

  const loadExpenses = async () => {
    setIsLoading(true);
    const data = await Expense.getAll("-date", 500);
    setExpenses(data);
    setFilteredExpenses(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
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
                All Expenses
              </h1>
              <p className="text-slate-600 mt-1">
                View, search, and manage all your recorded expenses.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl expense-card shadow-lg border-0">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <ExpensesTable expenses={filteredExpenses} isLoading={isLoading} />
      </div>
    </div>
  );
}
