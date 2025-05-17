const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary
} = require('../controllers/expenseController');

// Ensure authentication middleware is applied
router.use(auth);

// Add a new expense
router.post('/', addExpense);

// Get all expenses for the current user
router.get('/', getExpenses);

// Update a specific expense by its _id
router.put('/:id', updateExpense);

// Delete a specific expense by its _id
router.delete('/:id', deleteExpense);

// Get a summary of expenses, grouped by category
router.get('/summary/category', getSummary);

module.exports = router;
