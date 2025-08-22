import React, { useState, useEffect } from "react";
import Expense from "./../entities/expense";
import { useNavigate } from "react-router";
import createPageUrl from "../utils/createPageUrl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import ExpenseForm from "../components/expense/ExpenseForm";

export default function AddExpense() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [pageTitle, setPageTitle] = useState("Add New Expense");

  const urlParams = new URLSearchParams(window.location.search);
  const expenseId = urlParams.get("id");

  const loadExpense = async () => {
    try {
      const data = await Expense.get(expenseId);
      setExpenseToEdit({
        ...data,
        date: new Date(data.date), // Ensure date is a Date object
        tags: data.tags ? data.tags.join(", ") : "",
      });
    } catch (err) {
      setError("Failed to load expense details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expenseId) {
      setPageTitle("Edit Expense");
      loadExpense();
    }
  }, [expenseId]);

  const handleSubmit = async (expenseData) => {
    setIsLoading(true);
    try {
      if (expenseId) {
        await Expense.update(expenseId, expenseData);
      } else {
        await Expense.create(expenseData);
      }
      setIsSuccess(true);

      // Auto-redirect after success
      setTimeout(() => {
        navigate(
          expenseId
            ? createPageUrl(`ExpenseDetails?id=${expenseId}`)
            : createPageUrl("Dashboard")
        );
      }, 2000);
    } catch (error) {
      console.error("Error creating/updating expense:", error);
    }
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Expense {expenseId ? "Updated" : "Added"}!
          </h2>
          <p className="text-slate-600 mb-4">
            Your expense has been successfully{" "}
            {expenseId ? "updated" : "recorded"}.
          </p>
          <p className="text-sm text-slate-500">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

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
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {pageTitle}
              </h1>
              <p className="text-slate-600 mt-1">
                {expenseId
                  ? "Update the details of your expense."
                  : "Keep track of your spending with detailed categorization"}
              </p>
            </div>
          </div>
        </motion.div>

        {(expenseId && expenseToEdit) || !expenseId ? (
          <ExpenseForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={expenseToEdit}
            isEditing={!!expenseId}
          />
        ) : (
          <div className="text-center p-8">Loading expense data...</div>
        )}
      </div>
    </div>
  );
}
