import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import ExpenseDetailsPage from "./pages/ExpenseDetails";
import ExpensesPage from "./pages/Expenses";
import BudgetsPage from "./pages/Budgets";

function App() {
  return (
    <>
      <Routes>
        <Route
          element={<Layout />} // Wrap these routes in layout
        >
          <Route path="*" element={<Navigate to="/Dashboard" />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AddExpense" element={<AddExpense />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/ExpenseDetails" element={<ExpenseDetailsPage />} />
          <Route path="/Expenses" element={<ExpensesPage />} />
          <Route path="/Budgets" element={<BudgetsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
