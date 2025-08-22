// export default function Budget() {
//   return {
//     name: "Budget",
//     type: "object",
//     properties: {
//       category: {
//         type: "string",
//         enum: [
//           "food_dining",
//           "transportation",
//           "entertainment",
//           "utilities",
//           "shopping",
//           "healthcare",
//           "education",
//           "travel",
//           "subscriptions",
//           "groceries",
//           "housing",
//           "insurance",
//           "other",
//         ],
//         description: "Budget category",
//       },
//       monthly_limit: {
//         type: "number",
//         description: "Monthly budget limit for this category",
//       },
//       month: {
//         type: "string",
//         format: "date",
//         description: "Month this budget applies to (YYYY-MM-01 format)",
//       },
//     },
//     required: ["category", "monthly_limit", "month"],
//   };
// }
export default class Budget {
  static STORAGE_KEY = "budgets";

  constructor(data) {
    this.category = data.category;
    this.monthly_limit = data.monthly_limit;
    this.month = data.month;
    this.id = data.id || Date.now().toString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Get a specific budget by ID
  static get(id) {
    try {
      const budgets = this.getAll();
      const budget = budgets.find((b) => b.id === id);

      if (!budget) {
        throw new Error(`Budget with ID ${id} not found`);
      }

      return budget;
    } catch (error) {
      console.error("Error getting budget:", error);
      throw error;
    }
  }

  // Get budget by category and month
  static getByCategoryAndMonth(category, month) {
    try {
      const budgets = this.getAll();
      return budgets.find((b) => b.category === category && b.month === month);
    } catch (error) {
      console.error("Error getting budget by category and month:", error);
      return null;
    }
  }

  // Get all budgets for a specific month
  static getByMonth(month) {
    try {
      const budgets = this.getAll();
      return budgets.filter((b) => b.month === month);
    } catch (error) {
      console.error("Error getting budgets by month:", error);
      return [];
    }
  }

  // Get all budgets for a specific category
  static getByCategory(category) {
    try {
      const budgets = this.getAll();
      return budgets.filter((b) => b.category === category);
    } catch (error) {
      console.error("Error getting budgets by category:", error);
      return [];
    }
  }

  // Create a new budget
  static async create(budgetData) {
    try {
      // Validate required fields
      if (
        !budgetData.category ||
        !budgetData.monthly_limit ||
        !budgetData.month
      ) {
        throw new Error(
          "Missing required fields: category, monthly_limit, or month"
        );
      }

      // Check if budget already exists for this category and month
      const existingBudget = this.getByCategoryAndMonth(
        budgetData.category,
        budgetData.month
      );
      if (existingBudget) {
        throw new Error(
          `Budget already exists for ${budgetData.category} in ${budgetData.month}`
        );
      }

      const budgets = this.getAll();
      const newBudget = new Budget(budgetData);
      budgets.push(newBudget);
      this.saveAll(budgets);
      return newBudget;
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  }

  // Get all budgets
  static getAll() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading budgets:", error);
      return [];
    }
  }

  // Save all budgets
  static saveAll(budgets) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error("Error saving budgets:", error);
      throw error;
    }
  }

  // Update a budget
  static async update(id, updateData) {
    try {
      const budgets = this.getAll();
      const index = budgets.findIndex((budget) => budget.id === id);

      if (index === -1) {
        throw new Error("Budget not found");
      }

      // Prevent duplicate budgets for same category and month
      if (updateData.category || updateData.month) {
        const category = updateData.category || budgets[index].category;
        const month = updateData.month || budgets[index].month;
        const existingBudget = this.getByCategoryAndMonth(category, month);
        if (existingBudget && existingBudget.id !== id) {
          throw new Error(`Budget already exists for ${category} in ${month}`);
        }
      }

      budgets[index] = {
        ...budgets[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      this.saveAll(budgets);
      return budgets[index];
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  }

  // Delete a budget
  static async delete(id) {
    try {
      const budgets = this.getAll();
      const filteredBudgets = budgets.filter((budget) => budget.id !== id);
      this.saveAll(filteredBudgets);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  }

  // Get total monthly budget
  static getTotalMonthlyBudget(month) {
    try {
      const budgets = this.getByMonth(month);
      return budgets.reduce((total, budget) => total + budget.monthly_limit, 0);
    } catch (error) {
      console.error("Error calculating total monthly budget:", error);
      return 0;
    }
  }

  // Get current month's budget (YYYY-MM-01 format)
  static getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-01`;
  }

  // Get category name mapping
  static getCategoryName(category) {
    const categoryMap = {
      food_dining: "Food & Dining",
      transportation: "Transportation",
      entertainment: "Entertainment",
      utilities: "Utilities",
      shopping: "Shopping",
      healthcare: "Healthcare",
      education: "Education",
      travel: "Travel",
      subscriptions: "Subscriptions",
      groceries: "Groceries",
      housing: "Housing",
      insurance: "Insurance",
      other: "Other",
    };
    return categoryMap[category] || category;
  }

  // Validate budget data
  static validate(budgetData) {
    const errors = [];

    if (!budgetData.category) {
      errors.push("Category is required");
    }

    if (!budgetData.monthly_limit || budgetData.monthly_limit <= 0) {
      errors.push("Monthly limit must be a positive number");
    }

    if (!budgetData.month) {
      errors.push("Month is required");
    } else if (!/^\d{4}-\d{2}-01$/.test(budgetData.month)) {
      errors.push("Month must be in YYYY-MM-01 format");
    }

    return errors;
  }
}
// Create a new budget
// const budget = await Budget.create({
//   category: 'food_dining',
//   monthly_limit: 500,
//   month: '2024-01-01'
// });

// // Get all budgets for current month
// const currentMonth = Budget.getCurrentMonth();
// const monthlyBudgets = Budget.getByMonth(currentMonth);

// // Get a specific budget
// const budgetDetails = Budget.get('12345');

// // Update a budget
// await Budget.update('12345', { monthly_limit: 600 });

// // Delete a budget
// await Budget.delete('12345');

// // Get total monthly budget
// const totalBudget = Budget.getTotalMonthlyBudget('2024-01-01');

// // Check if category has budget for month
// const foodBudget = Budget.getByCategoryAndMonth('food_dining', '2024-01-01');