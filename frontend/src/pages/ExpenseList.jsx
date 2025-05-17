import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { ExpenseProvider, useExpenses } from '../context/ExpenseContext';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { expenseCategories } from '../utils/constants';

const ExpenseListContent = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!loading) {
      filterExpenses();
    }
  }, [expenses, loading, searchTerm, selectedCategory, dateRange, sortConfig]);

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(expense => {
        const title = expense.title ? expense.title.toLowerCase() : '';
        const description = expense.description ? expense.description.toLowerCase() : '';
        return title.includes(term) || description.includes(term);
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    if (dateRange.from) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(dateRange.to));
    }

    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredExpenses(filtered);
  };

  const handleSort = key => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleDeleteExpense = async id => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted successfully');
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setDateRange({ from: '', to: '' });
    setShowFilters(false);
    filterExpenses(); // Ensure filters are reset and expenses are recalculated
  };

  const getSortIcon = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />;
  };

  const renderFilters = () => {
    if (!showFilters) return null;
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {expenseCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            id="dateFrom"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            id="dateTo"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500">Manage your expense records</p>
        </div>
        <Link to="/expenses/add" className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Expense
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex space-x-2">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FilterIcon className="h-4 w-4 mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(searchTerm || selectedCategory || dateRange.from || dateRange.to) && (
              <button onClick={resetFilters} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Clear Filters
              </button>
            )}
          </div>
        </div>
        {renderFilters()}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['title', 'category', 'amount', 'date'].map(header => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(header)}>
                      <div className="flex items-center">
                        {header.charAt(0).toUpperCase() + header.slice(1)}
                        {getSortIcon(header)}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.length > 0 ? filteredExpenses.map((expense, index) => (
                  <tr key={expense._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/expenses/edit/${expense._id}`} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDeleteExpense(expense._id)} className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No expenses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ExpenseList = () => (
  <ExpenseProvider>
    <Layout>
      <ExpenseListContent />
    </Layout>
  </ExpenseProvider>
);

export default ExpenseList;
