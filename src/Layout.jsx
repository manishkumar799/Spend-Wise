import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import createPageUrl from "./utils/createPageUrl";
import {
  LayoutDashboard,
  Plus,
  BarChart3,
  Settings,
  TrendingUp,
  Wallet,
  ListChecks,
  Target, // Added ListChecks icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "All Expenses", // New navigation item
    url: createPageUrl("Expenses"), // New URL for all expenses
    icon: ListChecks, // Icon for all expenses
  },
  {
    title: "Add Expense",
    url: createPageUrl("AddExpense"),
    icon: Plus,
  },
  {
    title: "Budget Tracker", // New navigation item for Budget
    url: createPageUrl("Budgets"), // URL for Budget page
    icon: Target, // Icon for Budget Tracker
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 220 98% 61%;
          --primary-foreground: 220 13% 91%;
          --secondary: 220 14% 96%;
          --secondary-foreground: 220 9% 46%;
          --accent: 220 14% 96%;
          --accent-foreground: 220 9% 46%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 98%;
          --muted: 220 14% 96%;
          --muted-foreground: 220 9% 46%;
          --card: 0 0% 100%;
          --card-foreground: 220 13% 13%;
          --popover: 0 0% 100%;
          --popover-foreground: 220 13% 13%;
          --border: 220 13% 91%;
          --input: 220 13% 91%;
          --ring: 220 98% 61%;
          --radius: 0.75rem;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .expense-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  ExpenseTracker
                </h2>
                <p className="text-xs text-slate-500">
                  Smart financial management
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : ""
                        }`}
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <div className="flex-1">
                      <span className="text-slate-600">This Month</span>
                      <div className="font-semibold text-slate-900">$0.00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <div className="flex-1">
                      <span className="text-slate-600">Total Expenses</span>
                      <div className="font-semibold text-slate-900">0</div>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-medium text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  User
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Track your expenses
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">
                ExpenseTracker
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
