import React from "react";
import { useNavigate } from "react-router";
import createPageUrl from "../../utils/createPageUrl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

export default function ExpensesTable({ expenses, isLoading }) {
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(createPageUrl(`ExpenseDetails?id=${id}`));
  };

  return (
    <Card className="expense-card shadow-xl border-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
            ) : expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  onClick={() => handleRowClick(expense.id)}
                  className="cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-600">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${categoryColors[expense.category]}`}
                    >
                      <span className="mr-1.5">
                        {categoryIcons[expense.category]}
                      </span>
                      {expense.category
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-slate-500">
                    {expense.payment_method?.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    -${expense.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
