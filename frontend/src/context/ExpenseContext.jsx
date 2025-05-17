import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expense) => {
    try {
      const res = await axios.post('/expenses', expense);
      const newExpense = res.data;
      setExpenses((prev) => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw new Error('Failed to add expense');
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      const res = await axios.put(`/expenses/${id}`, updatedData);
      const updatedExpense = res.data;
      setExpenses((prev) =>
        prev.map((expense) => (expense._id === id ? updatedExpense : expense))
      );
      return updatedExpense;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw new Error('Failed to update expense');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw new Error('Failed to delete expense');
    }
  };

  const getExpense = (id) => {
    return expenses.find((expense) => expense._id === id);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
