export default function Budget() {
  return {
    name: "Budget",
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: [
          "food_dining",
          "transportation",
          "entertainment",
          "utilities",
          "shopping",
          "healthcare",
          "education",
          "travel",
          "subscriptions",
          "groceries",
          "housing",
          "insurance",
          "other",
        ],
        description: "Budget category",
      },
      monthly_limit: {
        type: "number",
        description: "Monthly budget limit for this category",
      },
      month: {
        type: "string",
        format: "date",
        description: "Month this budget applies to (YYYY-MM-01 format)",
      },
    },
    required: ["category", "monthly_limit", "month"],
  };
}
