import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  other: "📄"
};

const categoryColors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", 
  "#d084d0", "#ffb347", "#87ceeb", "#dda0dd", "#98fb98",
  "#f0e68c", "#ffa07a", "#b0c4de"
];

export default function CategoryBreakdown({ expenses }) {
  const getCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: amount,
        icon: categoryIcons[category] || "📄",
        color: categoryColors[index % categoryColors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const categoryData = getCategoryData();
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="expense-card shadow-lg border-0 col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-slate-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      ${category.value.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {((category.value / total) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <div className="text-4xl mb-4">📊</div>
            <p>No expenses to show category breakdown</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}