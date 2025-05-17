import React, { useState, useEffect } from 'react';
import { expenseCategories } from '../utils/constants';
const ExpenseForm = ({
  initialData = {},
  onSubmit,
  buttonText = 'Save',
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    ...initialData
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Update form if initialData changes
    if (Object.keys(initialData).length > 0) {
      setFormData({
        ...initialData,
        amount: initialData.amount?.toString() || ''
      });
    }
  }, [initialData]);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <div className="mt-1">
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.title ? 'border-red-300' : ''}`} />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input type="text" name="amount" id="amount" value={formData.amount} onChange={handleChange} className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${errors.amount ? 'border-red-300' : ''}`} placeholder="0.00" />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <div className="mt-1">
            <select id="category" name="category" value={formData.category} onChange={handleChange} className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.category ? 'border-red-300' : ''}`}>
              <option value="">Select a category</option>
              {expenseCategories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <div className="mt-1">
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.date ? 'border-red-300' : ''}`} />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
          {loading ? <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span> : buttonText}
        </button>
      </div>
    </form>;
};
export default ExpenseForm;