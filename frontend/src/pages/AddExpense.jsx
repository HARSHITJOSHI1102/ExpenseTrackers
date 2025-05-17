import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Assuming you're using sonner for notifications
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext';

const AddExpenseContent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addExpense } = useExpenses();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await addExpense(data);  // Use the context method to add the expense
      toast.success('Expense added successfully');
      navigate('/expenses');  // Navigate back to expenses list
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-sm text-gray-500">Create a new expense record</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ExpenseForm onSubmit={handleSubmit} buttonText="Add Expense" loading={loading} />
      </div>
    </div>
  );
};

const AddExpense = () => {
  return (
    <ExpenseProvider>
      <Layout>
        <AddExpenseContent />
      </Layout>
    </ExpenseProvider>
  );
};

export default AddExpense;
