const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// Add an expense
exports.addExpense = async (req, res) => {
  const { title, description, amount, category, date } = req.body;

  // description is optional now
  if (!title || !amount || !category || !date) {
    return res.status(400).json({ msg: 'Title, amount, category, and date are required.' });
  }

  try {
    const expense = await Expense.create({
      userId: req.user.id,
      title,
      description,     // added description here
      amount,
      category,
      date,
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error('Add Expense Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Get all expenses for current user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Get Expenses Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, description, amount, category, date } = req.body;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description, amount, category, date },   // added description here
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    res.json(expense);
  } catch (err) {
    console.error('Update Expense Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ msg: 'Invalid expense ID' });
    }

    const result = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    res.json({ msg: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete Expense Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Get expense summary grouped by category
exports.getSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: { $toDouble: '$amount' } } // Ensure proper number type
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    console.error('Get Summary Error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};
