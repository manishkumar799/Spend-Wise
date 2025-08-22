import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { value: "food_dining", label: "Food & Dining", icon: "🍽️" },
  { value: "groceries", label: "Groceries", icon: "🛒" },
  { value: "transportation", label: "Transportation", icon: "🚗" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "utilities", label: "Utilities", icon: "💡" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "subscriptions", label: "Subscriptions", icon: "📱" },
  { value: "housing", label: "Housing", icon: "🏠" },
  { value: "insurance", label: "Insurance", icon: "🛡️" },
  { value: "other", label: "Other", icon: "📄" },
];

export default function BudgetForm({
  onSubmit,
  isLoading,
  initialData,
  isEditing,
  existingCategories,
}) {
  const [formData, setFormData] = useState({
    category: initialData?.category || "",
    monthly_limit: initialData?.monthly_limit || "",
    month: initialData?.month || new Date().toISOString().slice(0, 7) + "-01",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthly_limit: parseFloat(formData.monthly_limit),
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter out categories that already have budgets for this month
  const availableCategories = categories.filter(
    (cat) =>
      !existingCategories.includes(cat.value) || cat.value === formData.category
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="expense-card shadow-xl border-0 max-w-xl mx-auto">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <Target className="w-6 h-6 text-green-600" />
            {isEditing ? "Edit Budget" : "Set New Budget"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-slate-700"
              >
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="monthly_limit"
                className="text-sm font-semibold text-slate-700"
              >
                Monthly Budget Limit *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="monthly_limit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthly_limit}
                  onChange={(e) =>
                    handleInputChange("monthly_limit", e.target.value)
                  }
                  placeholder="0.00"
                  className="text-lg font-semibold pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="month"
                className="text-sm font-semibold text-slate-700"
              >
                Month *
              </Label>
              <Input
                id="month"
                type="month"
                value={formData.month.slice(0, 7)}
                onChange={(e) =>
                  handleInputChange("month", e.target.value + "-01")
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg py-6"
              disabled={isLoading}
            >
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Budget"
                : "Set Budget"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
