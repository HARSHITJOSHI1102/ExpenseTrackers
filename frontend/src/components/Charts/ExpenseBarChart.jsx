import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ExpenseBarChart = ({ expenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Avoid chart rendering if there are no expenses
    if (expenses.length === 0) return;

    // Process data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    // Sum expenses by month for the current year
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === currentYear) {
        const month = expenseDate.getMonth();
        monthlyTotals[month] += parseFloat(expense.amount);
      }
    });

    // Clean up previous chart to prevent memory leaks and infinite rerenders
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthNames,
        datasets: [{
          label: `Expenses in ${currentYear}`,
          data: monthlyTotals,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `₹${context.raw.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '₹' + value;
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

export default ExpenseBarChart;
