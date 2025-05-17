import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext';

const EditExpenseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExpense, updateExpense, loading } = useExpenses();
  const [expense, setExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      const expenseData = getExpense(id);
      if (expenseData) {
        setExpense(expenseData);
      } else {
        toast.error('Expense not found');
        navigate('/expenses');
      }
    }
  }, [id, getExpense, loading, navigate]);

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);
      await updateExpense(id, data);
      toast.success('Expense updated successfully');
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to update expense');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !expense) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
        <p className="text-sm text-gray-500">Update the details of your expense</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ExpenseForm
          initialData={expense}
          onSubmit={handleSubmit}
          buttonText="Update Expense"
          loading={formLoading}
        />
      </div>
    </div>
  );
};

const EditExpense = () => {
  return (
    <ExpenseProvider>
      <Layout>
        <EditExpenseContent />
      </Layout>
    </ExpenseProvider>
  );
};

export default EditExpense;
