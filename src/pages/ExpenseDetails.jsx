import React, { useState, useEffect } from "react";
import Expense from "../entities/expense";
import { useNavigate } from "react-router";
import createPageUrl from "../utils/createPageUrl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  Type,
  Hash,
} from "lucide-react";

export default function ExpenseDetailsPage() {
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const expenseId = urlParams.get("id");

  useEffect(() => {
    if (!expenseId) {
      setError("No expense ID provided.");
      setIsLoading(false);
      return;
    }
    loadExpense();
  }, [expenseId]);

  const loadExpense = async () => {
    try {
      const data = await Expense.get(expenseId);
      setExpense(data);
    } catch (err) {
      setError("Failed to load expense details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await Expense.delete(expenseId);
      navigate(createPageUrl("Expenses"));
    } catch (err) {
      setError("Failed to delete expense.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/2 mb-8" />
        <Card className="expense-card shadow-xl border-0 max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
          <CardFooter className="gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="p-8 text-red-500">{error || "Expense not found."}</div>
    );
  }

  const detailItems = [
    {
      icon: Calendar,
      label: "Date",
      value: format(new Date(expense.date), "MMMM d, yyyy"),
    },
    {
      icon: Tag,
      label: "Category",
      value: (
        <Badge className="text-sm">{expense.category.replace(/_/g, " ")}</Badge>
      ),
    },
    {
      icon: CreditCard,
      label: "Payment Method",
      value: expense.payment_method?.replace(/_/g, " ") || "N/A",
    },
    { icon: Type, label: "Description", value: expense.description },
    {
      icon: Hash,
      label: "Tags",
      value: expense.tags?.length > 0 ? expense.tags.join(", ") : "No tags",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl("Expenses"))}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">Expense Details</h1>
      </div>
      <Card className="expense-card shadow-xl border-0 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-900">
            -${expense.amount.toFixed(2)}
          </CardTitle>
          <p className="text-slate-500">{expense.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {detailItems.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <item.icon className="w-5 h-5 mt-1 text-slate-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-slate-800 capitalize">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this expense record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            className="gap-2"
            onClick={() =>
              navigate(createPageUrl(`AddExpense?id=${expense.id}`))
            }
          >
            <Edit className="w-4 h-4" /> Edit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
