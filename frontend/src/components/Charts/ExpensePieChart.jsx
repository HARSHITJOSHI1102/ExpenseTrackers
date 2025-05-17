import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { expenseCategories } from '../../utils/constants';

const ExpensePieChart = ({ expenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (expenses.length === 0) return;

    // Initialize category totals
    const categoryTotals = {};
    expenseCategories.forEach(category => {
      categoryTotals[category] = 0;
    });

    // Sum expenses by category
    expenses.forEach(expense => {
      if (expense.category in categoryTotals) {
        categoryTotals[expense.category] += parseFloat(expense.amount);
      } else {
        // For any category not in our predefined list
        categoryTotals['Other'] = (categoryTotals['Other'] || 0) + parseFloat(expense.amount);
      }
    });

    // Filter out categories with no expenses
    const filteredCategories = Object.keys(categoryTotals).filter(category => categoryTotals[category] > 0);
    const categoryData = filteredCategories.map(category => categoryTotals[category]);

    // Generate colors
    const backgroundColors = [
      'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 
      'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 
      'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)', 'rgba(40, 159, 64, 0.6)', 
      'rgba(210, 199, 199, 0.6)'
    ];

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: filteredCategories,
        datasets: [{
          data: categoryData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round(value / total * 100);
                return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Cleanup chart instance when component unmounts or data changes
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [expenses]);  // This ensures the chart is updated only when expenses change

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-full h-64 md:h-80">
        <canvas ref={chartRef}></canvas>
      </div>
      {expenses.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No expense data available</p>
        </div>
      )}
    </div>
  );
};

export default ExpensePieChart;
