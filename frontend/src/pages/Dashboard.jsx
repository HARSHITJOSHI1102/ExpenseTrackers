import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import ExpenseBarChart from '../components/Charts/ExpenseBarChart';
import ExpensePieChart from '../components/Charts/ExpensePieChart';
import { useAuth } from '../context/AuthContext';

const DashboardContent = () => {
  const { expenses, loading, fetchExpenses } = useExpenses();
  const { currentUser } = useAuth();

  const [summary, setSummary] = useState({
    totalExpenses: 0,
    thisMonth: 0,
    lastMonth: 0,
    percentChange: 0
  });

  // Fetch expenses when the user is logged in
  useEffect(() => {
    if (currentUser && typeof fetchExpenses === 'function') {
     
    }
  }, [currentUser]);

  // Calculate summary once expenses are loaded
  useEffect(() => {
    if (!loading && expenses.length > 0) {
      calculateSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, loading]);

  const calculateSummary = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalExpenses = 0;
    let thisMonthExpenses = 0;
    let lastMonthExpenses = 0;

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();
      const amount = parseFloat(expense.amount);

      totalExpenses += amount;

      if (expenseMonth === currentMonth && expenseYear === currentYear) {
        thisMonthExpenses += amount;
      }
      if (expenseMonth === lastMonth && expenseYear === lastMonthYear) {
        lastMonthExpenses += amount;
      }
    });

    const percentChange =
      lastMonthExpenses === 0
        ? 100
        : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    const newSummary = {
      totalExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      percentChange,
    };

    // Only update state if values have changed
    if (
      summary.totalExpenses !== newSummary.totalExpenses ||
      summary.thisMonth !== newSummary.thisMonth ||
      summary.lastMonth !== newSummary.lastMonth ||
      summary.percentChange !== newSummary.percentChange
    ) {
      setSummary(newSummary);
    }
  };

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const renderCharts = !loading && expenses.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-600">Welcome, {currentUser?.name}!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold">₹{summary.totalExpenses.toFixed(2)}</p>
        </div>

        <div className="col-span-1 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-medium">Expenses This Month</h3>
          <p className="text-2xl font-bold">₹{summary.thisMonth.toFixed(2)}</p>
        </div>
      </div>

      {/* Percent Change */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium">Month-over-Month Change</h3>
        <div className="flex items-center text-lg">
          {summary.percentChange >= 0 ? (
            <ArrowUpIcon className="text-green-500 mr-2" />
          ) : (
            <ArrowDownIcon className="text-red-500 mr-2" />
          )}
          <span className={summary.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}>
            {summary.percentChange.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Charts */}
      {renderCharts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <h3 className="text-xl font-medium mb-2">Expense Overview</h3>
            <ExpenseBarChart expenses={expenses} />
          </div>
          <div className="col-span-1">
            <h3 className="text-xl font-medium mb-2">Expense Distribution</h3>
            <ExpensePieChart expenses={expenses} />
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4">Recent Expenses</h3>
        {recentExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Description</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="py-2 px-2">{expense.description}</td>
                    <td className="py-2 px-2">{expense.category || 'Uncategorized'}</td>
                    <td className="py-2 px-2 text-right">
                      ₹{parseFloat(expense.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent expenses found.</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ExpenseProvider>
      <Layout>
        <DashboardContent />
      </Layout>
    </ExpenseProvider>
  );
};

export default Dashboard;
